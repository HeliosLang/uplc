/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a - slope
 * @param {bigint} b - intercept
 * @returns {ArgSizesCost}
 */
export function makeArgSizesProdCost(a, b) {
    return new ArgSizesProdCost(a, b)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesProdCost {
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
     * @returns {bigint}
     */
    calcCost(argSizes) {
        if (argSizes.length != 2) {
            throw new Error(
                `expected only 2 arguments for ArgSizesProd cost model, got ${argSizes.length}`
            )
        }

        const [x, y] = argSizes

        return x * y * this.a + this.b
    }
}
