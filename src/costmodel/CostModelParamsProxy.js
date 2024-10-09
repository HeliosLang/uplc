import { None, isNone, isSome } from "@helios-lang/type-utils"

/**
 * @typedef {import("./Cost.js").Cost} Cost
 */

/**
 * @typedef {{
 *   get: (key: number, def?: Option<bigint>) => bigint
 * }} CostModelParamsProxyI
 */

/**
 * @implements {CostModelParamsProxyI}
 */
export class CostModelParamsProxy {
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
     * @param {Option<bigint>} def
     * @returns {bigint}
     */
    get(key, def = None) {
        const v = this._params[key]

        if (isNone(v)) {
            if (isSome(def)) {
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
