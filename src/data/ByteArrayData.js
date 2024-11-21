import { bytesToHex, compareBytes, toBytes } from "@helios-lang/codec-utils"
import { decodeBytes, encodeBytes } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { ByteArrayData, UplcData } from "../index.js"
 */

/**
 * @param {BytesLike} args
 * @returns {ByteArrayData}
 */
export function makeByteArrayData(args) {
    return new ByteArrayDataImpl(args)
}

/**
 * @param {UplcData} data
 * @param {string} msg
 * @returns {asserts data is ByteArrayData}
 */
export function assertByteArrayData(
    data,
    msg = `expected ByteArrayData, got ${data.toString()}`
) {
    if (data.kind != "bytes") {
        throw new Error(msg)
    }
}

/**
 * Calculates the mem size of a byte array without the DATA_NODE overhead.
 * @param {number[]} bytes
 * @returns {number}
 */
export function calcByteArrayMemSize(bytes) {
    const n = bytes.length

    if (n === 0) {
        return 1 // this is so annoying: haskell reference implementation says it should be 0, but current (20220925) testnet and mainnet settings say it's 1
    } else {
        return Math.floor((n - 1) / 8) + 1
    }
}

/**
 * Bytearray comparison, which can be used for sorting bytearrays
 *   `lengthFirst=true` is used for cbor-specific Bytearray comparison (see https://datatracker.ietf.org/doc/html/rfc7049#section-3.9) in Assets.sort()
 * @param {number[]} a
 * @param {number[]} b
 * @param {boolean} lengthFirst - defaults to false
 * @returns {number} - `-1` -> lt, `0` -> equals, `1` -> gt
 */
export function compareByteArrayData(a, b, lengthFirst = false) {
    return compareBytes(a, b, lengthFirst)
}

/**
 * @param {BytesLike} bytes
 * @returns {ByteArrayData}
 */
export function decodeByteArrayData(bytes) {
    return makeByteArrayData({ bytes: decodeBytes(bytes) })
}

/**
 * @param {UplcData} data
 * @param {string} msg
 * @returns {ByteArrayData}
 */
export function expectByteArrayData(
    data,
    msg = `expected ByteArrayData, got ${data.toString()}`
) {
    if (data.kind == "bytes") {
        return data
    } else {
        throw new Error(msg)
    }
}

/**
 * @implements {ByteArrayData}
 */
class ByteArrayDataImpl {
    /**
     * @readonly
     * @type {number[]}
     */
    bytes

    /**
     * @param {BytesLike} bytes
     */
    constructor(bytes) {
        this.bytes = toBytes(bytes)
    }

    /**
     * @type {"bytes"}
     */
    get kind() {
        return "bytes"
    }

    /**
     * @type {number}
     */
    get memSize() {
        return UPLC_DATA_NODE_MEM_SIZE + calcByteArrayMemSize(this.bytes)
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    isEqual(other) {
        if (other.kind == "bytes") {
            return compareByteArrayData(this.bytes, other.bytes) == 0
        } else {
            return false
        }
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeBytes(this.bytes, true)
    }

    /**
     * @returns {string}
     */
    toHex() {
        return bytesToHex(this.bytes)
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"bytes": "${this.toHex()}"}`
    }

    /**
     * @returns {string}
     */
    toString() {
        return `#${this.toHex()}`
    }
}
