import { makePairType } from "./UplcType.js"

/**
 * @import { FlatWriter, UplcPair, UplcType, UplcValue } from "src/index.js"
 */

/**
 * @param {{first: UplcValue, second: UplcValue}} args
 * @returns {UplcPair}
 */
export function makeUplcPair(args) {
    return new UplcPairImpl(args.first, args.second)
}

/**
 * Primitive pair value.
 * @implements {UplcPair}
 */
class UplcPairImpl {
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
     * @returns {UplcType}
     */
    get type() {
        return makePairType({
            first: this.first.type,
            second: this.second.type
        })
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
     * @param {FlatWriter} w
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
