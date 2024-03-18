/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesSumCost {
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
        const s = argSizes.reduce((s, a) => s + a, 0n)

        return s * this.a + this.b
    }
}
