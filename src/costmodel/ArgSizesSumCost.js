/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @returns {ArgSizesCost}
 */
export function makeArgSizesSumCost(a, b) {
    return new ArgSizesSumCost(a, b)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesSumCost {
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
     * @param  {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        const s = argSizes.reduce((s, a) => s + a, 0n)

        return s * this.a + this.b
    }
}
