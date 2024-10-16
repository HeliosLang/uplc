import { encodeZigZag, decodeZigZag } from "@helios-lang/codec-utils"
import { calcIntMemSize } from "../data/index.js"
import { INT_TYPE } from "./UplcType.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("./UplcValue.js").UplcInt} UplcInt
 * @typedef {import("./UplcValue.js").UplcType} UplcType
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @param {IntLike | {value: IntLike, signed?: boolean}} args
 * @returns {UplcInt}
 */
export function makeUplcInt(args) {
    if (typeof args == "number" || typeof args == "bigint") {
        return new UplcIntImpl(args)
    } else {
        return new UplcIntImpl(args.value, args.signed ?? true)
    }
}

/**
 * @param {FlatReader<any, UplcValue>} r
 * @param {boolean} signed
 * @returns {UplcInt}
 */
export function decodeUplcIntFromFlat(r, signed = false) {
    const i = r.readInt()

    if (signed) {
        return new UplcIntImpl(decodeZigZag(i), true)
    } else {
        return new UplcIntImpl(i, false)
    }
}

/**
 * Primitive integer UplcValue
 * @implements {UplcInt}
 */
class UplcIntImpl {
    /**
     * Arbitrary precision integer
     * @readonly
     * @type {bigint}
     */
    value

    /**
     * @readonly
     * @type {boolean}
     */
    signed

    /**
     * @param {IntLike} value
     * @param {boolean} signed - unsigned is only for internal use
     */
    constructor(value, signed = true) {
        if (typeof value == "number") {
            if (value % 1.0 != 0.0) {
                throw new Error("not a whole number")
            }

            this.value = BigInt(value)
        } else if (typeof value == "bigint") {
            this.value = value
        } else {
            throw new Error(`expected an integer, ${typeof value}`)
        }

        this.signed = signed
    }

    /**
     * @type {"int"}
     */
    get kind() {
        return "int"
    }

    /**
     * @type {number}
     */
    get memSize() {
        return calcIntMemSize(this.value)
    }

    /**
     * 4 for type + 7 for simple int, or 4 + (7 + 1)*ceil(n/7) for large int
     * @type {number}
     */
    get flatSize() {
        const n = this.toUnsigned().value.toString(2).length
        return 4 + (n <= 7 ? 7 : Math.ceil(n / 7) * 8)
    }

    /**
     * @returns {UplcType}
     */
    get type() {
        return INT_TYPE
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "int" && this.value == other.value
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        if (!this.signed) {
            throw new Error("not signed")
        }

        w.writeInt(this.toUnsigned().value)
    }

    /**
     * Encodes unsigned integer with plutus flat encoding.
     * Throws error if signed.
     * Used by encoding plutus core program version and debruijn indices.
     * @param {FlatWriter} w
     */
    toFlatUnsigned(w) {
        if (this.signed) {
            throw new Error("not unsigned")
        }

        w.writeInt(this.toUnsigned().value)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value.toString()
    }

    /**
     * Unapplies zigzag encoding
     * @returns {UplcInt}
     */
    toSigned() {
        if (this.signed) {
            return this
        } else {
            return new UplcIntImpl(decodeZigZag(this.value), true)
        }
    }

    /**
     * Applies zigzag encoding
     * @returns {UplcInt}
     */
    toUnsigned() {
        if (this.signed) {
            return new UplcIntImpl(encodeZigZag(this.value), false)
        } else {
            return this
        }
    }
}
