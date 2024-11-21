/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @returns {ArgSizesCost}
 */
export function makeArgSizesSecondCost(a, b) {
    return new ArgSizesSecondCost(a, b)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesSecondCost {
    /**
     * Slope
     * @readonly
     * @type {bigint}
     */
    a

    /**
     * Intercept
     * @readonly
     * @type {bigint}
     */
    b

    /**
     * @param {bigint} a - slope
     * @param {bigint} b - intercept
     */
    constructor(a, b) {
        this.a = a
        this.b = b
    }

    /**
     * @param {bigint[]} argSizes
     */
    calcCost(argSizes) {
        const s = argSizes[1]
        return this.a * s + this.b
    }
}
