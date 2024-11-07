import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const ifThenElse = {
    name: "ifThenElse",
    forceCount: 1,
    nArgs: 3,
    cpuModel: (params) => makeArgSizesConstCost(params.get(79)),
    memModel: (params) => makeArgSizesConstCost(params.get(80)),
    call: (args, _ctx) => {
        const cond = asUplcValue(args[0])

        if (cond?.kind != "bool") {
            throw new Error(
                `expected a bool for first argument of ifThenElse, got ${cond?.toString()}`
            )
        }

        return cond.value ? args[1] : args[2]
    }
}
