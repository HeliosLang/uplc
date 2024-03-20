import { ByteStream } from "@helios-lang/codec-utils"
import { decodeInt, encodeInt } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * Represents an unbounded integer (bigint).
 * @implements {UplcData}
 */
export class IntData {
    /**
     * Arbitrary precision
     * @readonly
     * @type {bigint}
     */
    value

    /**
     * @param {number | bigint} value
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
     * @param {UplcData} data
     * @param {string} msg
     * @returns {IntData}
     */
    static expect(data, msg = `expected IntData, got ${data.toString()}`) {
        if (data instanceof IntData) {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {ByteArrayLike} bytes
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
    equals(other) {
        return other instanceof IntData && other.value == this.value
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeInt(this.value)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value.toString()
    }

    /**
     * Returns string, not js object, because of unbounded integers
     * @returns {string}
     */
    toSchemaJson() {
        return `{"int": ${this.value.toString()}}`
    }
}
