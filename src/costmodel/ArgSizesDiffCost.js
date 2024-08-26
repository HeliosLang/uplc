import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesDiffCost {
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
