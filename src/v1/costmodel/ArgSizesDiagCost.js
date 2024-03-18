import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesDiagCost {
    /**
     *
     * @param {CostModelParamsProxy} params
     * @param {string} key
     */
    constructor(params, key) {
        this.a = params.get(`${key}-slope`)
        this.b = params.get(`${key}-intercept`)
        this.constant = params.get(`${key}-constant`)
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
