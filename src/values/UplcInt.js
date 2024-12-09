import { encodeZigZag, decodeZigZag } from "@helios-lang/codec-utils"
import { calcIntMemSize } from "../data/index.js"
import { INT_TYPE } from "./UplcType.js"

/**
 * @import { IntLike } from "@helios-lang/codec-utils"
 * @import { FlatReader, FlatWriter, UplcInt, UplcType, UplcValue } from "../index.js"
 */

/**
 * @overload
 * @param {IntLike} value
 * @param {boolean} [signed]
 * @returns {UplcInt}
 */
/**
 * @overload
 * @param {{value: IntLike, signed?: boolean}} args
 * @returns {UplcInt}
 */
/**
 * @param {(
 *   [IntLike, boolean?] |
 *   [{value: IntLike, signed?: boolean}]
 * )} args
 * @returns {UplcInt}
 */
export function makeUplcInt(...args) {
    if (args.length == 1) {
        const arg = args[0]
        if (typeof arg == "number" || typeof arg == "bigint") {
            return new UplcIntImpl(arg)
        } else {
            return new UplcIntImpl(arg.value, arg.signed ?? true)
        }
    } else {
        return new UplcIntImpl(args[0], args[1])
    }
}

/**
 * @param {FlatReader} r
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
     * 4 for type + (7 + 1)*ceil(log2(value)/7) for data
     * @type {number}
     */
    get flatSize() {
        const n = this.toUnsigned().value.toString(2).length
        return 4 + Math.ceil(n / 7) * 8
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
        return (
            other.kind == "int" &&
            this.value == other.value &&
            this.signed == other.signed
        )
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
