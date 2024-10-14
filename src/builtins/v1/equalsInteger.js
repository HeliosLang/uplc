import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsInteger = {
    name: "equalsInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(67), params.get(66)),
    memModel: (params) => new ArgSizesConstCost(params.get(68)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer for the first argument of equalsInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected an integer for the second argument of equalsInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(a.value == b.value))
    }
}
