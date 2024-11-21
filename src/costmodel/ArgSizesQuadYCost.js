/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @typedef {{
 *   c0: bigint
 *   c1: bigint
 *   c2: bigint
 * }} QuadCoeffs
 */

/**
 * @param {QuadCoeffs} coeffs
 * @returns {ArgSizesCost}
 */
export function makeArgSizesQuadYCost(coeffs) {
    return new ArgSizesQuadYCost(coeffs)
}

/**
 * Let `y` denote the size of the second arg:
 *
 *   cost = c0 + c1*y + c2*y*y
 *
 * @implements {ArgSizesCost}
 */
class ArgSizesQuadYCost {
    /**
     * @readonly
     * @type {QuadCoeffs}
     */
    coeffs

    /**
     * @param {QuadCoeffs} coeffs
     */
    constructor(coeffs) {
        this.coeffs = coeffs
    }

    /**
     * @param  {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        const [_x, y] = argSizes

        const { c0, c1, c2 } = this.coeffs

        return c0 + c1 * y + c2 * y * y
    }
}
