/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesDiagCost {
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
                `ArgSizesDiag cost model can only be used for two arguments, got ${argSizes.length} arguments`
            )
        }

        const [x, y] = argSizes

        if (x == y) {
            return this.a * x + this.b
        } else {
            return this.constant
        }
    }
}
