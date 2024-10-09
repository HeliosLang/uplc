import { decodeInt, encodeInt } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("@helios-lang/codec-utils").IntLike} IntLike
 * @typedef {import("./UplcData.js").IntDataI} IntDataI
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents an unbounded integer (bigint).
 * @implements {IntDataI}
 */
export class IntData {
    /**
     * Arbitrary precision
     * @readonly
     * @type {bigint}
     */
    value

    /**
     * @param {IntLike} value
     */
    constructor(value) {
        if (typeof value == "number") {
            if (value % 1.0 != 0.0) {
                throw new Error("not a whole number")
            }

            this.value = BigInt(value)
        } else if (typeof value == "bigint") {
            this.value = value
        } else {
            throw new Error("not a valid integer")
        }
    }

    /**
     * @type {"int"}
     */
    get kind() {
        return "int"
    }

    /**
     * @param {UplcData} data
     * @returns {asserts data is IntDataI}
     */
    static assert(data) {
        if (data.kind != "int") {
            throw new Error(`expected IntData, got ${data.toString()}`)
        }
    }

    /**
     * @param {UplcData} data
     * @param {string} msg
     * @returns {IntDataI}
     */
    static expect(data, msg = `expected IntData, got ${data.toString()}`) {
        if (data.kind == "int") {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {BytesLike} bytes
     * @returns {IntData}
     */
    static fromCbor(bytes) {
        return new IntData(decodeInt(bytes))
    }

    /**
     * Calculate the mem size of a integer (without the DATA_NODE overhead)
     * @param {bigint} value
     * @returns {number}
     */
    static memSizeInternal(value) {
        if (value == 0n) {
            return 1
        } else {
            const abs = value > 0n ? value : -value

            return Math.floor(Math.floor(Math.log2(Number(abs))) / 64) + 1
        }
    }

    /**
     * @type {number}
     */
    get memSize() {
        return UPLC_DATA_NODE_MEM_SIZE + IntData.memSizeInternal(this.value)
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "int" && other.value == this.value
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeInt(this.value)
    }

    /**
     * Returns string, not js object, because of unbounded integers
     * @returns {string}
     */
    toSchemaJson() {
        return `{"int": ${this.value.toString()}}`
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value.toString()
    }
}
