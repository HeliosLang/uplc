/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @typedef {{
 *   c00: bigint
 *   c10: bigint
 *   c01: bigint
 *   c20: bigint
 *   c11: bigint
 *   c02: bigint
 * }} QuadCoeffs
 */

/**
 * Let `x` denote the size of the first arg, and `y` the size of the second arg:
 *
 * if below diagonal:
 *   cost = max(minimum, c00 + c10*x + c01*y + c20*x*x + c11*x*y + c02*y*y)
 * if above diagonal: constant
 *
 * @implements {ArgSizesCost}
 */
export class ArgSizesQuadXYCost {
    /**
     * @readonly
     * @type {bigint}
     */
    constant

    /**
     * @readonly
     * @type {bigint}
     */
    minimum

    /**
     * @readonly
     * @type {QuadCoeffs}
     */
    coeffs

    /**
     * @param{bigint} constant
     * @param {bigint} minimum
     * @param {QuadCoeffs} coeffs
     */
    constructor(constant, minimum, coeffs) {
        this.constant = constant
        this.minimum = minimum
        this.coeffs = coeffs
    }

    /**
     * @param  {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        const [x, y] = argSizes

        if (x < y) {
            return this.constant
        } else {
            const { c00, c10, c01, c20, c11, c02 } = this.coeffs

            let s =
                c00 +
                c10 * x +
                c01 * y +
                c20 * x * x +
                c11 * x * y +
                c02 * y * y

            return s < this.minimum ? this.minimum : s
        }
    }
}
