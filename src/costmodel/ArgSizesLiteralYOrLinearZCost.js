/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesLiteralYOrLinearZCost {
    /**
     * @readonly
     * @type {bigint}
     */
    slope

    /**
     * @readonly
     * @type {bigint}
     */
    intercept

    /**
     * @param {bigint} slope
     * @param {bigint} intercept
     */
    constructor(slope, intercept) {
        this.slope = slope
        this.intercept = intercept
    }

    /**
     * @param {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        const [_x, y, z] = argSizes

        // TODO: this doesn't make any sense, should we have access to the original arg values as well?
        if (y == 0n) {
            return z * this.slope + this.intercept
        } else {
            // also weird: the number bytes is not the number of words?
            return y
        }
    }
}
