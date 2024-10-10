import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { UplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanInteger = {
    name: "lessThanInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(95), params.get(94)),
    memModel: (params) => new ArgSizesConstCost(params.get(96)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of lessThanInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of lessThanInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value < b.value))
    }
}
