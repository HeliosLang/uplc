import { expectSome, isNone } from "@helios-lang/type-utils"

/**
 * @typedef {import("./Cost.js").Cost} Cost
 */

/**
 * @typedef {{
 *   get: (key: number) => bigint
 * }} CostModelParamsProxyI
 */

/**
 * @implements {CostModelParamsProxyI}
 */
export class CostModelParamsProxy {
    /**
     * @private
     * @readonly
     * @type {Record<number, number>}
     */
    params

    /**
     * @param {Record<number, number>} params
     */
    constructor(params) {
        this.params = params
    }

    /**
     * Throws an error if key not found
     * @param {number} key
     * @returns {bigint}
     */
    get(key) {
        const v = this.params[key]

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
}

/**
 * @implements {CostModelParamsProxyI}
 */
export class PreConwayCostModelParamsProxy {
    /**
     * @private
     * @readonly
     * @type {Record<string, number>}
     */
    params

    /**
     * @private
     * @readonly
     * @type {Record<number, string>}
     */
    compatMap

    /**
     * @param {Record<string, number>} params
     * @param {Record<number, string>} compatMap
     */
    constructor(params, compatMap) {
        this.params = params
        this.compatMap = compatMap
    }

    /**
     * Throws an error if key not found
     * @param {number} id
     * @returns {bigint}
     */
    get(id) {
        const key = expectSome(this.compatMap[id])
        const v = expectSome(this.params[key])

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
}
