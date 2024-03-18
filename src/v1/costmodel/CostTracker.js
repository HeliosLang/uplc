import { CostModel } from "./CostModel.js"

/**
 * @typedef {import("./Cost.js").Cost} Cost
 */

/**
 * @implements {Cost}
 */
export class CostTracker {
    /**
     * @type {bigint}
     */
    cpu

    /**
     * @type {bigint}
     */
    mem

    /**
     * @readonly
     * @type {CostModel}
     */
    costModel

    /**
     * @param {CostModel} costModel
     */
    constructor(costModel) {
        this.costModel = costModel
        this.cpu = 0n
        this.mem = 0n
    }

    /**
     * @private
     * @param {Cost} d
     */
    incrCost(d) {
        this.cpu += d.cpu
        this.mem += d.mem
    }

    incrBuiltinCost() {
        this.incrCost(this.costModel.builtinTerm)
    }

    incrCallCost() {
        this.incrCost(this.costModel.callTerm)
    }

    incrConstCost() {
        this.incrCost(this.costModel.constTerm)
    }

    incrDelayCost() {
        this.incrCost(this.costModel.delayTerm)
    }

    incrForceCost() {
        this.incrCost(this.costModel.forceTerm)
    }

    incrLambdaCost() {
        this.incrCost(this.costModel.lambdaTerm)
    }

    incrStartupCost() {
        this.incrCost(this.costModel.startupTerm)
    }

    incrVarCost() {
        this.incrCost(this.costModel.varTerm)
    }

    /**
     * @param {string} name
     * @param  {bigint[]} argSizes
     */
    incrArgSizesCost(name, argSizes) {
        this.incrCost(this.costModel.builtins[name](argSizes))
    }
}
