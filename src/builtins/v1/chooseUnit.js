import { ArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const chooseUnit = {
    name: "chooseUnit",
    forceCount: 1,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(37)),
    memModel: (params) => new ArgSizesConstCost(params.get(38)),
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
