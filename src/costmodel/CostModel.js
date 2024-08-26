import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("./ArgSizesCost.js").ArgSizesCostClass} ArgSizesCostClass
 * @typedef {import("./Cost.js").Cost} Cost
 * @typedef {import("./CostModelParamsProxy.js").CostModelParamsProxyI} CostModelParamsProxyI
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
 *   cpuModel: ArgSizesCostClass
 *   memModel: ArgSizesCostClass
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
     * @param {CostModelParamsProxyI} params
     * @param {BuiltinCostModel[]} builtins
     */
    constructor(params, builtins) {
        this.builtinTerm = {
            cpu: params.get(19),
            mem: params.get(20)
        }

        this.callTerm = {
            cpu: params.get(17),
            mem: params.get(18)
        }

        this.constTerm = {
            cpu: params.get(21),
            mem: params.get(22)
        }

        this.delayTerm = {
            cpu: params.get(23),
            mem: params.get(24)
        }

        this.forceTerm = {
            cpu: params.get(25),
            mem: params.get(26)
        }

        this.lambdaTerm = {
            cpu: params.get(27),
            mem: params.get(28)
        }

        this.startupTerm = {
            cpu: params.get(29),
            mem: params.get(30)
        }

        this.varTerm = {
            cpu: params.get(31),
            mem: params.get(32)
        }

        this.builtins = Object.fromEntries(
            builtins.map(
                /**
                 * @param {BuiltinCostModel} b
                 * @returns {[string, (argSizes: bigint[]) => Cost]}
                 */
                (b) => {
                    const cpuModel = b.cpuModel(params)
                    const memModel = b.memModel(params)

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
