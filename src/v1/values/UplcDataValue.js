import { decodeUplcData } from "../../data/index.js"
import { FlatReader, FlatWriter, bytesFlatSize } from "../../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("../../data/index.js").UplcData} UplcData
 */

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * `UplcValue` that wraps a `UplcData` instance.
 * @implements {UplcValue}
 */
export class UplcDataValue {
    /**
     * @readonly
     * @type {UplcData}
     */
    value

    /**
     * @param {UplcData} data
     */
    constructor(data) {
        this.value = data
    }

    /**
     * @param {FlatReader} r
     * @returns {UplcDataValue}
     */
    static fromFlat(r) {
        const bytes = r.readBytes()
        const data = decodeUplcData(bytes)
        return new UplcDataValue(data)
    }

    /**
     * @type {number}
     */
    get memSize() {
        return this.value.memSize
    }

    /**
     * Same number of header bits as UplcByteArray
     * @type {number}
     */
    get flatSize() {
        const bytes = this.value.toCbor()
        return bytesFlatSize(bytes)
    }

    /**
     * @returns {string}
     */
    get typeBits() {
        return UplcType.newDataType().typeBits
    }

    /**
     * @returns {string}
     */
    toString() {
        return `data(${this.value.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBytes(this.value.toCbor())
    }

    /**
     * @param {UplcDataValue | UplcData} data
     * @returns {UplcData}
     */
    static unwrap(data) {
        if (data instanceof UplcDataValue) {
            return data.value
        } else {
            return data
        }
    }
}
