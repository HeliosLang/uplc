import {
    bytesToHex,
    BitReader,
    equalsBytes,
    toBytes
} from "@helios-lang/codec-utils"
import { ByteArrayData } from "../data/index.js"
import { decodeFlatBytes, bytesFlatSize, FlatWriter } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("./UplcValue.js").UplcByteArrayI} UplcByteArrayI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive equivalent of `ByteArrayData`.
 * @implements {UplcByteArrayI}
 */
export class UplcByteArray {
    /**
     * @readonly
     * @type {number[]}
     */
    bytes

    /**
     * @param {ByteArrayLike} bytes
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
        return ByteArrayData.memSizeInternal(this.bytes)
    }

    /**
     * 4 for header, 8 bits per byte, 8 bits per chunk of 256 bytes, 8 bits final padding
     * @type {number}
     */
    get flatSize() {
        return bytesFlatSize(this.bytes.length)
    }

    /**
     * @returns {UplcType}
     */
    get type() {
        return UplcType.byteArray()
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "bytes" && equalsBytes(this.bytes, other.bytes)
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBytes(this.bytes)
    }

    /**
     * Returns hex representation of byte array
     * @returns {string}
     */
    toString() {
        return `#${bytesToHex(this.bytes)}`
    }
}
