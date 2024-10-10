import { UplcType } from "./UplcType.js"

/**
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("./UplcValue.js").UplcPairI} UplcPairI
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * Primitive pair value.
 * @implements {UplcPairI}
 */
export class UplcPair {
    /**
     * @readonly
     * @type {UplcValue}
     */
    first

    /**
     * @readonly
     * @type {UplcValue}
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
     * @type {"pair"}
     */
    get kind() {
        return "pair"
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
     * @returns {UplcTypeI}
     */
    get type() {
        return UplcType.pair(this.first.type, this.second.type)
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            other.kind == "pair" &&
            other.first.isEqual(this.first) &&
            other.second.isEqual(this.second)
        )
    }

    /**
     * @param {FlatWriterI} w
     */
    toFlat(w) {
        this.first.toFlat(w)
        this.second.toFlat(w)
    }

    /**
     * @returns {string}
     */
    toString() {
        return `(${this.first.toString()}, ${this.second.toString()})`
    }
}
