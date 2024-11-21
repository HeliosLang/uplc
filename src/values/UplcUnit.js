import { UNIT_TYPE } from "./UplcType.js"

/**
 * @import { FlatWriter, UplcType, UplcUnit, UplcValue } from "../index.js"
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
