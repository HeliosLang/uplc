import { F12 } from "@helios-lang/crypto"
import { BLS12_381_ML_RESULT_TYPE } from "./UplcType.js"

/**
 * @import { FieldElement12 } from "@helios-lang/crypto"
 * @import { Bls12_381_MlResult, FlatWriter, UplcType, UplcValue } from "../index.js"
 */

/**
 * @param {FieldElement12} args
 * @returns {Bls12_381_MlResult}
 */
export function makeBls12_381_MlResult(args) {
    return new Bls12_381_MlResultImpl(args)
}

/**
 * @implements {Bls12_381_MlResult}
 */
class Bls12_381_MlResultImpl {
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
     * @type {UplcType}
     */
    get type() {
        return BLS12_381_ML_RESULT_TYPE
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
     * @param {FlatWriter} _writer
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
