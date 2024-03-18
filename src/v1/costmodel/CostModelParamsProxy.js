/**
 * @typedef {import("./Cost.js").Cost} Cost
 */

/**
 * @typedef {import("./CostModelParams.js").CostModelParams} CostModelParams
 */

export class CostModelParamsProxy {
    /**
     * @private
     * @readonly
     * @type {CostModelParams}
     */
    params

    /**
     * @private
     * @readonly
     * @type {Set<string>}
     */
    accessed

    /**
     * @param {CostModelParams} params
     */
    constructor(params) {
        this.params = params
        this.accessed = new Set()
    }

    /**
     * Throws an error if key not found
     * @param {string} key
     * @returns {bigint}
     */
    get(key) {
        const v = this.params[key]

        // TODO: throw error if already accessed before
        this.accessed.add(key)

        if (!v) {
            throw new Error(`CostModelParams.${key} undefined`)
        }

        if (!(typeof v == "number")) {
            throw new Error(`CostModelParams.${key} isn't a number`)
        }

        if (v % 1.0 != 0.0) {
            throw new Error(`CostModelParams.${key} isn't a whole number`)
        }

        return BigInt(v)
    }

    /**
     * @param {string} key
     * @returns {Cost}
     */
    getTermParams(key) {
        return {
            cpu: this.get(`cek${key}Cost-exBudgetCPU`),
            mem: this.get(`cek${key}Cost-exBudgetMemory`)
        }
    }

    /**
     * @param {string} key
     * @returns {[bigint, bigint]}
     */
    getLinearParams(key) {
        const a = this.get(`${key}-slope`)
        const b = this.get(`${key}-intercept`)

        return [a, b]
    }
}
