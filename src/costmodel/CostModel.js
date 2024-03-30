import { DEFAULT_COST_MODEL_PARAMS_V1 } from "./CostModelParamsV1.js"
import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCostClass} ArgSizesCostClass
 * @typedef {import("./Cost.js").Cost} Cost
 * @typedef {import("./CostModelParamsV1.js").CostModelParamsV1} CostModelParams
 * @typedef {import("./CostModelParamsV1.js").CostModelParamKeyV1} CostModelParamKey
 */

/**
 * @typedef {{
 *   memSize: number
 * }} UplcValue
 */

/**
 * @typedef {{
 *   name: string
 *   CpuModel: ArgSizesCostClass
 *   MemModel: ArgSizesCostClass
 * }} BuiltinCostModel
 */

export class CostModel {
    /**
     * @readonly
     * @type {Cost}
     */
    builtinTerm

    /**
     * @readonly
     * @type {Cost}
     */
    callTerm

    /**
     * @readonly
     * @type {Cost}
     */
    constTerm

    /**
     * @readonly
     * @type {Cost}
     */
    delayTerm

    /**
     * @readonly
     * @type {Cost}
     */
    forceTerm

    /**
     * @readonly
     * @type {Cost}
     */
    lambdaTerm

    /**
     * @readonly
     * @type {Cost}
     */
    startupTerm

    /**
     * @readonly
     * @type {Cost}
     */
    varTerm

    /**
     * @readonly
     * @type {{[name: string]: (argSizes: bigint[]) => Cost}}
     */
    builtins

    /**
     * @param {CostModelParams} rawParams
     * @param {BuiltinCostModel[]} builtins
     */
    constructor(rawParams, builtins) {
        const params = new CostModelParamsProxy(rawParams)

        this.builtinTerm = params.getTermParams("Builtin")
        this.callTerm = params.getTermParams("Apply")
        this.constTerm = params.getTermParams("Const")
        this.delayTerm = params.getTermParams("Delay")
        this.forceTerm = params.getTermParams("Force")
        this.lambdaTerm = params.getTermParams("Lam")
        this.startupTerm = params.getTermParams("Startup")
        this.varTerm = params.getTermParams("Var")

        this.builtins = Object.fromEntries(
            builtins.map(
                /**
                 * @param {BuiltinCostModel} b
                 * @returns {[string, (argSizes: bigint[]) => Cost]}
                 */
                (b) => {
                    const cpuModel = new b.CpuModel(
                        params,
                        `${b.name}-cpu-arguments`
                    )
                    const memModel = new b.MemModel(
                        params,
                        `${b.name}-memory-arguments`
                    )

                    /**
                     * @param {bigint[]} argSizes
                     * @returns {Cost}
                     */
                    const calc = (argSizes) => {
                        return {
                            cpu: cpuModel.calcCost(argSizes),
                            mem: memModel.calcCost(argSizes)
                        }
                    }

                    return [b.name, calc]
                }
            )
        )
    }
}
