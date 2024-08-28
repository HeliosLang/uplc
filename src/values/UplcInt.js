import { encodeZigZag, decodeZigZag } from "@helios-lang/codec-utils"
import { IntData } from "../data/index.js"
import { FlatReader, FlatWriter } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("./UplcValue.js").UplcIntI} UplcIntI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive integer UplcValue
 * @implements {UplcIntI}
 */
export class UplcInt {
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
     * @param {FlatReader<any, UplcValue>} r
     * @param {boolean} signed
     * @returns {UplcInt}
     */
    static fromFlat(r, signed = false) {
        let res = new UplcInt(r.readInt(), false)

        if (signed) {
            res = res.toSigned() // unzigzag is performed here
        }

        return res
    }

    /**
     * @type {number}
     */
    get memSize() {
        return IntData.memSizeInternal(this.value)
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
        return UplcType.int()
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
            return new UplcInt(decodeZigZag(this.value), true)
        }
    }

    /**
     * Applies zigzag encoding
     * @returns {UplcInt}
     */
    toUnsigned() {
        if (this.signed) {
            return new UplcInt(encodeZigZag(this.value), false)
        } else {
            return this
        }
    }
}
