import { byteToBits } from "@helios-lang/codec-utils"

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Represents the typeBits of a UPLC primitive.
 */
export class UplcType {
    #typeBits

    /**
     * @param {string} typeBits
     */
    constructor(typeBits) {
        this.#typeBits = typeBits
    }

    /**
     * @returns {UplcType}
     */
    static newDataType() {
        return new UplcType("1000")
    }

    /**
     * @returns {UplcType}
     */
    static newDataPairType() {
        return new UplcType(["0111", "0111", "0110", "1000", "1000"].join("1"))
    }

    /**
     * @param {number[]} lst
     * @returns {UplcType}
     */
    static fromNumbers(lst) {
        return new UplcType(lst.map((x) => byteToBits(x, 4, false)).join("1"))
    }

    /**
     * @type {string}
     */
    get typeBits() {
        return this.#typeBits
    }

    /**
     * @param {UplcValue} value
     * @returns {boolean}
     */
    isSameType(value) {
        return this.#typeBits == value.typeBits
    }

    /**
     * @returns {boolean}
     */
    isData() {
        return this.#typeBits == UplcType.newDataType().#typeBits
    }

    /**
     * @returns {boolean}
     */
    isDataPair() {
        return this.#typeBits == UplcType.newDataPairType().#typeBits
    }
}
