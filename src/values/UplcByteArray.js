import { bytesToHex, equalsBytes, toBytes } from "@helios-lang/codec-utils"
import { calcByteArrayMemSize } from "../data/index.js"
import { bytesFlatSize } from "../flat/index.js"
import { BYTE_ARRAY_TYPE } from "./UplcType.js"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { FlatReader, FlatWriter, UplcByteArray, UplcType, UplcValue } from "../index.js"
 */

/**
 * @param {BytesLike} args
 * @returns {UplcByteArray}
 */
export function makeUplcByteArray(args) {
    return new UplcByteArrayImpl(args)
}

/**
 * @param {FlatReader} reader
 * @returns {UplcByteArray}
 */
export function decodeUplcByteArrayFromFlat(reader) {
    return new UplcByteArrayImpl(reader.readBytes())
}

/**
 * Primitive equivalent of `ByteArrayData`.
 * @implements {UplcByteArray}
 */ class UplcByteArrayImpl {
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
        return calcByteArrayMemSize(this.bytes)
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
        return BYTE_ARRAY_TYPE
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
