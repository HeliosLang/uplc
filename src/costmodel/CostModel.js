/**
 * @import { ArgSizesCostClass, BuiltinCostModel, Cost, CostModel, CostModelParamsProxy, UplcValue } from "../index.js"
 */

/**
 * @param {CostModelParamsProxy} params
 * @param {BuiltinCostModel[]} builtins
 * @returns {CostModel}
 */
export function makeCostModel(params, builtins) {
    return new CostModelImpl(params, builtins)
}

/**
 * @implements {CostModel}
 */
class CostModelImpl {
    /**
     * @readonly
     * @type {Cost}
     */
    applyTerm

    /**
     * @readonly
     * @type {Cost}
     */
    builtinTerm

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
     * @type {Cost}
     */
    constrTerm

    /**
     * @readonly
     * @type {Cost}
     */
    caseTerm

    /**
     * @readonly
     * @type {Record<string, (argSizes: bigint[]) => Cost>}
     */
    builtins

    /**
     * @param {CostModelParamsProxy} params
     * @param {BuiltinCostModel[]} builtins
     */
    constructor(params, builtins) {
        this.applyTerm = {
            cpu: params.get(17),
            mem: params.get(18)
        }

        this.builtinTerm = {
            cpu: params.get(19),
            mem: params.get(20)
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

        this.constrTerm = {
            cpu: params.get(193, 0n),
            mem: params.get(194, 0n)
        }

        this.caseTerm = {
            cpu: params.get(195, 0n),
            mem: params.get(196, 0n)
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
