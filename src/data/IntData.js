import { decodeInt, encodeInt } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @import { BytesLike, IntLike } from "@helios-lang/codec-utils"
 * @import { IntData, UplcData } from "../index.js"
 */

/**
 * @param {IntLike} value
 * @returns {IntData}
 */
export function makeIntData(value) {
    if (typeof value == "number") {
        if (value % 1.0 != 0.0) {
            throw new Error("not a whole number")
        }

        return new IntDataImpl(BigInt(value))
    } else if (typeof value == "bigint") {
        return new IntDataImpl(value)
    } else {
        throw new Error("not a valid integer")
    }
}

/**
 * @param {UplcData} data
 * @returns {asserts data is IntData}
 */
export function assertIntData(data) {
    if (data.kind != "int") {
        throw new Error(`expected IntData, got ${data.toString()}`)
    }
}

/**
 * @param {BytesLike} bytes
 * @returns {IntData}
 */
export function decodeIntData(bytes) {
    return new IntDataImpl(decodeInt(bytes))
}

/**
 * @param {UplcData} data
 * @param {string} msg
 * @returns {IntData}
 */
export function expectIntData(
    data,
    msg = `expected IntData, got ${data.toString()}`
) {
    if (data.kind == "int") {
        return data
    } else {
        throw new Error(msg)
    }
}

/**
 * Calculate the mem size of a integer (without the DATA_NODE overhead)
 * @param {bigint} value
 * @returns {number}
 */
export function calcIntMemSize(value) {
    if (value == 0n) {
        return 1
    } else {
        const abs = value > 0n ? value : -value

        return Math.floor(Math.floor(Math.log2(Number(abs))) / 64) + 1
    }
}

/**
 * Represents an unbounded integer (bigint).
 * @implements {IntData}
 */
class IntDataImpl {
    /**
     * Arbitrary precision
     * @readonly
     * @type {bigint}
     */
    value

    /**
     * @param {bigint} value
     */
    constructor(value) {
        this.value = value
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
        return UPLC_DATA_NODE_MEM_SIZE + calcIntMemSize(this.value)
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
