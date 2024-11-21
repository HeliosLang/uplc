import { makeConstrData } from "../data/index.js"
import { BOOL_TYPE } from "./UplcType.js"

/**
 * @import { ConstrData, FlatReader, FlatWriter, UplcBool, UplcType, UplcValue } from "../index.js"
 */

/**
 * @param {boolean} args
 * @returns {UplcBool}
 */
export function makeUplcBool(args) {
    return new UplcBoolImpl(args)
}

/**
 * @param {FlatReader} r
 * @returns {UplcBool}
 */
export function decodeUplcBoolFromFlat(r) {
    return new UplcBoolImpl(r.readBool())
}

/**
 * JS/TS equivalent of the Helios language `Bool` type.
 * @implements {UplcBool}
 */
class UplcBoolImpl {
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
        return BOOL_TYPE
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
        return makeConstrData({ tag: this.value ? 1 : 0, fields: [] })
    }
}
