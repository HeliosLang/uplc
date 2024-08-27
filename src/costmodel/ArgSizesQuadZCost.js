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
 * Let `z` denote the size of the third arg:
 *
 *   cost = c0 + c1*z + c2*z*z
 *
 * @implements {ArgSizesCost}
 */
export class ArgSizesQuadZCost {
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
        const [_x, _y, z] = argSizes

        const { c0, c1, c2 } = this.coeffs

        return c0 + c1 * z + c2 * z * z
    }
}