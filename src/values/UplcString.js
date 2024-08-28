import { decodeUtf8, encodeUtf8 } from "@helios-lang/codec-utils"
import { FlatReader, FlatWriter, bytesFlatSize } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("./UplcValue.js").UplcStringI} UplcStringI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive string value.
 * @implements {UplcStringI}
 */
export class UplcString {
    /**
     * @readonly
     * @type {string}
     */
    value

    /**
     * @param {string} value
     */
    constructor(value) {
        this.value = value
    }

    /**
     * @type {"string"}
     */
    get kind() {
        return "string"
    }

    /**
     * @param {FlatReader<any, UplcValue>} r
     * @returns {UplcString}
     */
    static fromFlat(r) {
        const bytes = r.readBytes()
        const s = decodeUtf8(bytes)
        return new UplcString(s)
    }

    /**
     * @type {number}
     */
    get memSize() {
        return this.value.length
    }

    /**
     * @type {number}
     */
    get flatSize() {
        const bytes = encodeUtf8(this.value)
        return bytesFlatSize(bytes.length)
    }

    /**
     * @type {string}
     */
    get string() {
        return this.value
    }

    /**
     * @returns {UplcType}
     */
    get type() {
        return UplcType.string()
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "string" && other.value == this.value
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        const bytes = encodeUtf8(this.value)
        w.writeBytes(bytes)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `"${this.value}"`
    }
}
