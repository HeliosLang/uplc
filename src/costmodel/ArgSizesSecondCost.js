import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesSecondCost {
    /**
     * @param {CostModelParamsProxy} params
     * @param {string} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-slope`)
        this.b = params.get(`${key}-intercept`)
    }

    /**
     * @param {bigint[]} argSizes
     */
    calcCost(argSizes) {
        const s = argSizes[1]
        return this.a * s + this.b
    }
}
