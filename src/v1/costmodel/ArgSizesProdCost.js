/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesProdCost {
    /**
     * @param {CostModelParamsProxy} params
     * @param {string} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-model-arguments-slope`)
        this.b = params.get(`${key}-model-arguments-intercept`)
        this.constant = params.get(`${key}-constant`)
    }

    /**
     * @param {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        if (argSizes.length != 2) {
            throw new Error(
                `expected only 2 arguments for ArgSizesProd cost model, got ${argSizes.length}`
            )
        }

        const [x, y] = argSizes

        if (x < y) {
            return this.constant
        } else {
            return x * y * this.a + this.b
        }
    }
}
