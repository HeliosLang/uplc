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
     * @param {bigint[]} _argSizes
     * @returns {bigint}
     */
    calcCost(_argSizes) {
        return this.constant
    }
}
