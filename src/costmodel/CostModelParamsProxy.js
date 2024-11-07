/**
 * @import { Cost, CostModelParamsProxy } from "src/index.js"
 */

/**
 * @param {number[]} params
 * @returns {CostModelParamsProxy}
 */
export function makeCostModelParamsProxy(params) {
    return new CostModelParamsProxyImpl(params)
}

/**
 * @implements {CostModelParamsProxy}
 */
class CostModelParamsProxyImpl {
    /**
     * @private
     * @readonly
     * @type {number[]}
     */
    _params

    /**
     * @param {number[]} params
     */
    constructor(params) {
        this._params = params
    }

    /**
     * Throws an error if key not found
     * @param {number} key
     * @param {bigint | undefined} def
     * @returns {bigint}
     */
    get(key, def = undefined) {
        const v = this._params[key]

        if (v === undefined) {
            if (def !== undefined) {
                return def
            } else {
                throw new Error(`CostModelParams[${key}] undefined`)
            }
        }

        if (!(typeof v == "number")) {
            throw new Error(`CostModelParams[${key}] isn't a number`)
        }

        if (v % 1.0 != 0.0) {
            throw new Error(`CostModelParams[${key}] isn't a whole number`)
        }

        return BigInt(v)
    }
}
