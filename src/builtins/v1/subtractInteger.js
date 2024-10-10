import { ArgSizesMaxCost } from "../../costmodel/index.js"
import { UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const subtractInteger = {
    name: "subtractInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMaxCost(params.get(146), params.get(145)),
    memModel: (params) => new ArgSizesMaxCost(params.get(148), params.get(147)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected integer for first arg of subtractInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected integer for second arg of subtractInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.value - b.value))
    }
}
