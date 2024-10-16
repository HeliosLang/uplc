import { UNIT_TYPE } from "./UplcType.js"

/**
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("./UplcValue.js").UplcType} UplcType
 * @typedef {import("./UplcValue.js").UplcUnit} UplcUnit
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive unit value.
 * @implements {UplcUnit}
 */
class UplcUnitImpl {
    constructor() {}

    /**
     * @type {"unit"}
     */
    get kind() {
        return "unit"
    }

    /**
     * @type {number}
     */
    get memSize() {
        return 1
    }

    /**
     * @type {number}
     */
    get flatSize() {
        return 4
    }

    /**
     * @returns {UplcType}
     */
    get type() {
        return UNIT_TYPE
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return other.kind == "unit"
    }

    /**
     * @returns {string}
     */
    toString() {
        return "()"
    }

    /**
     * Doesn't add any bits (typeBits are written by the UplcConst term)
     * @param {FlatWriter} _writer
     */
    toFlat(_writer) {}
}

/**
 * @type {UplcUnit}
 */
export const UNIT_VALUE = new UplcUnitImpl()
