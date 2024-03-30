import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesDiffCost {
    /**
     * @param {CostModelParamsProxy} params
     * @param {string} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-slope`)
        this.b = params.get(`${key}-intercept`)
        this.min = params.get(`${key}-minimum`)
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
