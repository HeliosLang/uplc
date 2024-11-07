/**
 * @import { ArgSizesCost } from "src/index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @returns {ArgSizesCost}
 */
export function makeArgSizesFirstCost(a, b) {
    return new ArgSizesFirstCost(a, b)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesFirstCost {
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
        const s = argSizes[0]
        return this.a * s + this.b
    }
}
