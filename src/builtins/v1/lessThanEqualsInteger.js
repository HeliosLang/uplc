import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsInteger = {
    name: "lessThanEqualsInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(92), params.get(91)),
    memModel: (params) => new ArgSizesConstCost(params.get(93)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of lessThanEqualsInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of lessThanEqualsInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value <= b.value))
    }
}
