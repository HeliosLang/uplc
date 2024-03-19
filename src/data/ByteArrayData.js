import { ByteStream, bytesToHex, encodeUtf8 } from "@helios-lang/codec-utils"
import { decodeBytes, encodeBytes } from "@helios-lang/cbor"
import { UPLC_DATA_NODE_MEM_SIZE } from "./UplcData.js"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @implements {UplcData}
 */
export class ByteArrayData {
    /**
     * @readonly
     * @type {number[]}
     */
    value

    /**
     * @param {number[]} value
     */
    constructor(value) {
        this.value = value
    }

    /**
     * @param {UplcData} data
     * @param {string} msg
     * @returns {ByteArrayData}
     */
    static expect(
        data,
        msg = `expected ByteArrayData, got ${data.toString()}`
    ) {
        if (data instanceof ByteArrayData) {
            return data
        } else {
            throw new Error(msg)
        }
    }

    /**
     * @param {number[] | ByteStream} bytes
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
     * Returns a copy of the underlying bytes.
     * @type {number[]}
     */
    get bytes() {
        return this.value.slice()
    }

    /**
     * @type {number}
     */
    get memSize() {
        return (
            UPLC_DATA_NODE_MEM_SIZE + ByteArrayData.memSizeInternal(this.value)
        )
    }

    /**
     * @returns {string}
     */
    toHex() {
        return bytesToHex(this.value)
    }

    /**
     * @type {string}
     */
    get hex() {
        return this.toHex()
    }

    /**
     * @returns {string}
     */
    toString() {
        return `#${this.toHex()}`
    }

    /**
     * @returns {string}
     */
    toSchemaJson() {
        return `{"bytes": "${this.toHex()}"}`
    }

    /**
     * @returns {number[]}
     */
    toCbor() {
        return encodeBytes(this.value, true)
    }

    /**
     * @param {UplcData} other
     * @returns {boolean}
     */
    equals(other) {
        if (other instanceof ByteArrayData) {
            return ByteArrayData.compare(this.value, other.value) == 0
        } else {
            return false
        }
    }

    /**
     * Bytearray comparison, which can be used for sorting bytearrays
     *   `lengthFirst=true` is used for cbor-specific Bytearray comparison (see https://datatracker.ietf.org/doc/html/rfc7049#section-3.9) in Assets.sort()
     * @param {number[]} a
     * @param {number[]} b
     * @param {boolean} lengthFirst - defaults to false
     * @returns {-1 | 0 | 1} - `-1` -> lt, `0` -> equals, `1` -> gt
     */
    static compare(a, b, lengthFirst = false) {
        if (a.length != b.length) {
            if (!lengthFirst) {
                for (let i = 0; i < Math.min(a.length, b.length); i++) {
                    if (a[i] != b[i]) {
                        return a[i] < b[i] ? -1 : 1
                    }
                }
            }

            return a.length < b.length ? -1 : 1
        } else {
            for (let i = 0; i < a.length; i++) {
                if (a[i] != b[i]) {
                    return a[i] < b[i] ? -1 : 1
                }
            }

            return 0
        }
    }
}
