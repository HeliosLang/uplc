import {
    bytesToHex,
    compareBytes,
    encodeUtf8,
    toBytes
} from "@helios-lang/codec-utils"
import { decodeBytes, encodeBytes } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("./UplcData.js").ByteArrayDataI} ByteArrayDataI
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @implements {ByteArrayDataI}
 */
export class ByteArrayData {
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
     * @param {UplcData} data
     * @param {string} msg
     * @returns {asserts data is ByteArrayDataI}
     */
    static assert(
        data,
        msg = `expected ByteArrayData, got ${data.toString()}`
    ) {
        if (data.kind != "bytes") {
            throw new Error(msg)
        }
    }

    /**
     * @param {UplcData} data
     * @param {string} msg
     * @returns {ByteArrayDataI}
     */
    static expect(
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
     * @param {BytesLike} bytes
     * @returns {ByteArrayData}
     */
    static fromCbor(bytes) {
        return new ByteArrayData(decodeBytes(bytes))
    }

    /**
     * Applies utf-8 encoding
     * @param {string} s
     * @returns {ByteArrayData}
     */
    static fromString(s) {
        return new ByteArrayData(encodeUtf8(s))
    }

    /**
     * Bytearray comparison, which can be used for sorting bytearrays
     *   `lengthFirst=true` is used for cbor-specific Bytearray comparison (see https://datatracker.ietf.org/doc/html/rfc7049#section-3.9) in Assets.sort()
     * @param {number[]} a
     * @param {number[]} b
     * @param {boolean} lengthFirst - defaults to false
     * @returns {number} - `-1` -> lt, `0` -> equals, `1` -> gt
     */
    static compare(a, b, lengthFirst = false) {
        return compareBytes(a, b, lengthFirst)
    }

    /**
     * Calculates the mem size of a byte array without the DATA_NODE overhead.
     * @param {number[]} bytes
     * @returns {number}
     */
    static memSizeInternal(bytes) {
        const n = bytes.length

        if (n === 0) {
            return 1 // this is so annoying: haskell reference implementation says it should be 0, but current (20220925) testnet and mainnet settings say it's 1
        } else {
            return Math.floor((n - 1) / 8) + 1
        }
    }

    /**
     * @type {number}
     */
    get memSize() {
        return (
            UPLC_DATA_NODE_MEM_SIZE + ByteArrayData.memSizeInternal(this.bytes)
        )
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    isEqual(other) {
        if (other.kind == "bytes") {
            return ByteArrayData.compare(this.bytes, other.bytes) == 0
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
