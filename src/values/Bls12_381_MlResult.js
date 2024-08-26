import { F12 } from "@helios-lang/crypto"
import { FlatWriter } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("@helios-lang/crypto").FieldElement12} FieldElement12
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @implements {UplcValue}
 */
export class Bls12_381_MlResult {
    /**
     * @readonly
     * @type {FieldElement12}
     */
    element

    /**
     * @param {FieldElement12} element
     */
    constructor(element) {
        this.element = element
    }

    /**
     * Not serializable under any circumstance, so simply return 0 for now
     * @type {number}
     */
    get flatSize() {
        return 0
    }

    /**
     * 12*48bytes, or 576 bytes, or 72 words (576/8)
     * @type {number}
     */
    get memSize() {
        return 72
    }

    /**
     * @type {UplcType}
     */
    get type() {
        return UplcType.bls12_381_MlResult()
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            other instanceof Bls12_381_MlResult &&
            F12.equals(this.element, other.element)
        )
    }

    /**
     * @param {FlatWriter} writer
     */
    toFlat(writer) {
        throw new Error("Bls12_381_MlResult can't be serialized")
    }

    /**
     * @returns {string}
     */
    toString() {
        return `Bls12_381_MlResult`
    }
}
