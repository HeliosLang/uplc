/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @typedef {{
 *   c0: bigint
 *   c1: bigint
 *   c2: bigint
 * }} QuadCoeffs
 */

/**
 * Let `y` denote the size of the second arg:
 *
 *   cost = c0 + c1*y + c2*y*y
 *
 * @implements {ArgSizesCost}
 */
export class ArgSizesQuadYCost {
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
