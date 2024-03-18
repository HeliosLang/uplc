import { ConstrData } from "../../data/index.js"
import { FlatReader, FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * JS/TS equivalent of the Helios language `Bool` type.
 * @implements {UplcValue}
 */
export class UplcBool {
    /**
     * @readonly
     * @type {boolean}
     */
    value

    /**
     * @param {boolean} value
     */
    constructor(value) {
        this.value = value
    }

    /**
     * @param {FlatReader} r
     * @returns {UplcBool}
     */
    static fromFlat(r) {
        const b = r.readBits(1) == 1
        return new UplcBool(b)
    }

    /**
     * @type {number}
     */
    get memSize() {
        return 1
    }

    /**
     * 4 for type, 1 for value
     * @type {number}
     */
    get flatSize() {
        return 5
    }

    /**
     * @returns {string}
     */
    get typeBits() {
        return "0100"
    }

    /**
     * @type {boolean}
     */
    get bool() {
        return this.value
    }

    /**
     * @returns {ConstrData}
     */
    toData() {
        return new ConstrData(this.value ? 1 : 0, [])
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value ? "true" : "false"
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBool(this.value)
    }
}
