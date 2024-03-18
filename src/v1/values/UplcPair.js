import { FlatWriter } from "../../flat/index.js"

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive pair value.
 * @implements {UplcValue}
 */
export class UplcPair {
    /**
     * @readonly
     * @typedef {UplcValue}
     */
    first

    /**
     * @readonly
     * @typedef {UplcValue}
     */
    second

    /**
     * @param {UplcValue} first
     * @param {UplcValue} second
     */
    constructor(first, second) {
        this.first = first
        this.second = second
    }

    /**
     * @type {number}
     */
    get memSize() {
        return this.first.memSize + this.second.memSize
    }

    /**
     * 16 additional type bits on top of first and second bits
     * @type {number}
     */
    get flatSize() {
        return 16 + this.first.flatSize + this.second.flatSize
    }

    /**
     * 7 (7 (6) (fst)) (snd)
     * @returns {string}
     */
    get typeBits() {
        return [
            "0111",
            "0111",
            "0110",
            this.first.typeBits,
            this.second.typeBits
        ].join("1")
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(${this.first.toString()}, ${this.second.toString()})`
    }

    /**
     * @param {FlatWriter} w
     */
    toFlat(w) {
        this.first.toFlat(w)
        this.second.toFlat(w)
    }
}
