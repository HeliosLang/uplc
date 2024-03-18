import { FlatWriter } from "../../flat/FlatWriter.js"

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive unit value.
 * @implements {UplcValue}
 */
export class UplcUnit {
    constructor() {}

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
     * @returns {string}
     */
    get typeBits() {
        return "0011"
    }

    /**
     * @returns {string}
     */
    toString() {
        return "()"
    }

    /**
     * Doesn't add any bits (typeBits are written by the UplcConst term)
     * @param {FlatWriter} writer
     */
    toFlat(writer) {}
}
