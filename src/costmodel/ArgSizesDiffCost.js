/**
 * @import { ArgSizesCost } from "../index.js"
 */

/**
 * @param {bigint} a
 * @param {bigint} b
 * @param {bigint} minimum
 * @returns {ArgSizesCost}
 */
export function makeArgSizesDiffCost(a, b, minimum) {
    return new ArgSizesDiffCost(a, b, minimum)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesDiffCost {
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
    min

    /**
     * @param {bigint} a - slope
     * @param {bigint} b - intercept
     * @param {bigint} minimum
     */
    constructor(a, b, minimum) {
        this.a = a
        this.b = b
        this.min = minimum
    }

    /**
     * @param {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        if (argSizes.length != 2) {
            throw new Error(
                `ArgSizesDiff cost model can only be used for two arguments, got ${argSizes.length} arguments`
            )
        }

        const [x, y] = argSizes
        const d = x - y

        if (d < this.min) {
            return this.min
        } else {
            return d
        }
    }
}
