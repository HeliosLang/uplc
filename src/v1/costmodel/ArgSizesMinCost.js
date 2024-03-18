import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesMinCost {
    /**
     *
     * @param {CostModelParamsProxy} params
     * @param {*} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-slope`)
        this.b = params.get(`${key}-intercept`)
    }

    /**
     * @param {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        const m = argSizes
            .slice(1)
            .reduce((m, a) => (a < m ? a : m), argSizes[0])

        return this.a * m + this.b
    }
}
