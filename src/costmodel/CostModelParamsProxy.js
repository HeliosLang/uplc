/**
 * @typedef {import("./Cost.js").Cost} Cost
 * @typedef {import("./CostModelParamsV1.js").CostModelParamsV1} CostModelParams
 */

import { isNone } from "@helios-lang/type-utils"

export class CostModelParamsProxy {
    /**
     * @private
     * @readonly
     * @type {{[key: string]: number}}
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

        if (isNone(v)) {
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
