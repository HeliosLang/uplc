import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCost} ArgSizesCost
 */

/**
 * @implements {ArgSizesCost}
 */
export class ArgSizesConstCost {
    /**
     * @readonly
     * @type {bigint}
     */
    constant

    /**
     * @param {bigint} constant
     */
    constructor(constant) {
        this.constant = constant
    }

    /**
     * @param {bigint[]} argSizes
     * @returns {bigint}
     */
    calcCost(argSizes) {
        return this.constant
    }
}
