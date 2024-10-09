import { ConstrData } from "../data/index.js"
import { FlatReader, FlatWriter } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("./UplcValue.js").UplcBoolI} UplcBoolI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * JS/TS equivalent of the Helios language `Bool` type.
 * @implements {UplcBoolI}
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
     * @type {"bool"}
     */
    get kind() {
        return "bool"
    }

    /**
     * @param {FlatReader<any, UplcValue>} r
     * @returns {UplcBool}
     */
    static fromFlat(r) {
        return new UplcBool(r.readBool())
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
     * @returns {UplcType}
     */
    get type() {
        return UplcType.bool()
    }

    /**
     * @type {boolean}
     */
    get bool() {
        return this.value
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "bool" && other.value == this.value
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        w.writeBool(this.value)
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.value ? "true" : "false"
    }

    /**
     * @returns {ConstrData}
     */
    toUplcData() {
        return new ConstrData(this.value ? 1 : 0, [])
    }
}
