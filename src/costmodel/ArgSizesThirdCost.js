/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @returns {ArgSizesCost}
 */
export function makeArgSizesThirdCost(a, b) {
    return new ArgSizesThirdCost(a, b)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesThirdCost {
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
        const s = argSizes[2]
        return this.a * s + this.b
    }
}
