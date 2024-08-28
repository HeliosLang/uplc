import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcBool } from "../../values/UplcBool.js"
import { asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const ifThenElse = {
    name: "ifThenElse",
    forceCount: 1,
    nArgs: 3,
    cpuModel: (params) => new ArgSizesConstCost(params.get(79)),
    memModel: (params) => new ArgSizesConstCost(params.get(80)),
    call: (args, ctx) => {
        const cond = asUplcValue(args[0])

        if (cond?.kind != "bool") {
            throw new Error(
                `expected a bool for first argument of ifThenElse, got ${cond?.toString()}`
            )
        }

        return cond.value ? args[1] : args[2]
    }
}
