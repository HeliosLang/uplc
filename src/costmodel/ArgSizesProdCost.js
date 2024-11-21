/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @param {bigint} constant
 * @returns {ArgSizesCost}
 */
export function makeArgSizesProdCost(a, b, constant) {
    return new ArgSizesProdCost(a, b, constant)
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
     * @readonly
     * @type {bigint}
     */
    constant

    /**
     * @param {bigint} a - slope
     * @param {bigint} b - intercept
     * @param {bigint} constant
     */
    constructor(a, b, constant) {
        this.a = a
        this.b = b
        this.constant = constant
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

        if (x < y) {
            return this.constant
        } else {
            return x * y * this.a + this.b
        }
    }
}
