import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const chooseUnit = {
    name: "chooseUnit",
    forceCount: 1,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(37)),
    memModel: (params) => makeArgSizesConstCost(params.get(38)),
    call: (args, _ctx) => {
        const a = asUplcValue(args[0])

        if (a?.kind != "unit") {
            throw new Error(
                `expected a unit value for the first argument of chooseUnit, got ${a?.toString()}`
            )
        }

        return args[1]
    }
}
