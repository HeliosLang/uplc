/**
 * @import { ArgSizesCost } from "src/index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @param {bigint} constant
 * @returns {ArgSizesCost}
 */
export function makeArgSizesDiagCost(a, b, constant) {
    return new ArgSizesDiagCost(a, b, constant)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesDiagCost {
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
