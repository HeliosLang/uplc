/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesMaxCost {
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
        const m = argSizes.reduce((m, s) => (s > m ? s : m), 0n)
        return m * this.a + this.b
    }
}
