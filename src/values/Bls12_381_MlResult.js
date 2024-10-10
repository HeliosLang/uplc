import { F12 } from "@helios-lang/crypto"
import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("@helios-lang/crypto").FieldElement12} FieldElement12
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcValue.js").Bls12_381_MlResultI} Bls12_381_MlResultI
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @implements {Bls12_381_MlResultI}
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
     * @type {"bls12_381_mlresult"}
     */
    get kind() {
        return "bls12_381_mlresult"
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
     * @type {UplcTypeI}
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
            other.kind == "bls12_381_mlresult" &&
            F12.equals(this.element, other.element)
        )
    }

    /**
     * @param {FlatWriterI} _writer
     */
    toFlat(_writer) {
        throw new Error("Bls12_381_MlResult can't be serialized")
    }

    /**
     * @returns {string}
     */
    toString() {
        return `Bls12_381_MlResult`
    }
}
