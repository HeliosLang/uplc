import { decodeUtf8, encodeUtf8 } from "@helios-lang/codec-utils"
import { bytesFlatSize } from "../flat/index.js"
import { STRING_TYPE } from "./UplcType.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("./UplcValue.js").UplcString} UplcString
 * @typedef {import("./UplcValue.js").UplcType} UplcType
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @param {string} args
 * @returns {UplcString}
 */
export function makeUplcString(args) {
    return new UplcStringImpl(args)
}

/**
 * @param {FlatReader<any, UplcValue>} r
 * @returns {UplcString}
 */
export function decodeUplcStringFromFlat(r) {
    const bytes = r.readBytes()
    const s = decodeUtf8(bytes)
    return new UplcStringImpl(s)
}

/**
 * Primitive string value.
 * @implements {UplcString}
 */
class UplcStringImpl {
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
        return STRING_TYPE
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
