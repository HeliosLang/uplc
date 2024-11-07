/**
 * @import { ArgSizesCost } from "src/index.js"
 */

/**
 * @param {bigint} constant
 * @returns {ArgSizesCost}
 */
export function makeArgSizesConstCost(constant) {
    return new ArgSizesConstCost(constant)
}

/**
 * @implements {ArgSizesCost}
 */
class ArgSizesConstCost {
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
     * @param {bigint[]} _argSizes
     * @returns {bigint}
     */
    calcCost(_argSizes) {
        return this.constant
    }
}
