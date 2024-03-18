import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesMaxCost {
    /**
     * @param {CostModelParamsProxy} params
     * @param {string} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-slope`)
        this.b = params.get(`${key}-intercept`)
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
