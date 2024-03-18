import { bytesToHex, BitReader } from "@helios-lang/codec-utils"
import { ByteArrayData } from "../../data/index.js"
import { decodeFlatBytes, bytesFlatSize, FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive equivalent of `ByteArrayData`.
 * @implements {UplcValue}
 */
export class UplcByteArray {
    /**
     * @readonly
     * @type {number[]}
     */
    value

    /**
     * @param {number[]} bytes
     */
    constructor(bytes) {
        this.value = bytes
    }

    /**
     * @param {BitReader} reader
     * @returns {UplcByteArray}
     */
    static fromFlat(reader) {
        return new UplcByteArray(decodeFlatBytes(reader))
    }

    /**
     * @type {number}
     */
    get memSize() {
        return ByteArrayData.memSizeInternal(this.value)
    }

    /**
     * 4 for header, 8 bits per byte, 8 bits per chunk of 256 bytes, 8 bits final padding
     * @type {number}
     */
    get flatSize() {
        return bytesFlatSize(this.value)
    }

    /**
     * @returns {string}
     */
    get typeBits() {
        return "0001"
    }

    /**
     * Returns hex representation of byte array
     * @returns {string}
     */
    toString() {
        return `#${bytesToHex(this.value)}`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBytes(this.value)
    }
}
