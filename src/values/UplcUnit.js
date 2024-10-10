import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcUnitI} UplcUnitI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive unit value.
 * @implements {UplcUnitI}
 */
export class UplcUnit {
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
     * @returns {UplcTypeI}
     */
    get type() {
        return UplcType.unit()
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
     * @param {FlatWriterI} _writer
     */
    toFlat(_writer) {}
}
