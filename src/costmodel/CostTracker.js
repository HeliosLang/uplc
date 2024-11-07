/**
 * @import { Cost, CostBreakdown, CostModel, CostTracker } from "src/index.js"
 */

/**
 * @param {CostModel} model
 * @returns {CostTracker}
 */
export function makeCostTracker(model) {
    return new CostTrackerImpl(model)
}

/**
 * @implements {CostTracker}
 */
class CostTrackerImpl {
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
     * @readonly
     * @type {CostBreakdown}
     */
    breakdown

    /**
     * @param {CostModel} costModel
     */
    constructor(costModel) {
        this.costModel = costModel
        this.cpu = 0n
        this.mem = 0n
        this.breakdown = {}
    }

    /**
     * @private
     * @param {string} key
     * @param {Cost} d
     */
    incrCost(key, d) {
        this.cpu += d.cpu
        this.mem += d.mem

        if (key in this.breakdown) {
            const entry = this.breakdown[key]
            entry.count += 1
            entry.mem += d.mem
            entry.cpu += d.cpu
        } else {
            this.breakdown[key] = { mem: d.mem, cpu: d.cpu, count: 1 }
        }
    }

    incrBuiltinCost() {
        this.incrCost("builtinTerm", this.costModel.builtinTerm)
    }

    incrCallCost() {
        this.incrCost("callTerm", this.costModel.callTerm)
    }

    incrConstCost() {
        this.incrCost("constTerm", this.costModel.constTerm)
    }

    incrDelayCost() {
        this.incrCost("delayTerm", this.costModel.delayTerm)
    }

    incrForceCost() {
        this.incrCost("forceTerm", this.costModel.forceTerm)
    }

    incrLambdaCost() {
        this.incrCost("lambdaTerm", this.costModel.lambdaTerm)
    }

    incrStartupCost() {
        this.incrCost("startupTerm", this.costModel.startupTerm)
    }

    incrVarCost() {
        this.incrCost("varTerm", this.costModel.varTerm)
    }

    /**
     * @param {string} name
     * @param  {bigint[]} argSizes
     */
    incrArgSizesCost(name, argSizes) {
        this.incrCost(name, this.costModel.builtins[name](argSizes))
    }
}
