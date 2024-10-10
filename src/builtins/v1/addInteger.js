import { ArgSizesMaxCost } from "../../costmodel/index.js"
import { UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const addInteger = {
    name: "addInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMaxCost(params.get(1), params.get(0)),
    memModel: (params) => new ArgSizesMaxCost(params.get(3), params.get(2)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected integer for first arg of addInteger, got ${a?.toString()}`
            )
        }

        if (b?.kind != "int") {
            throw new Error(
                `expected integer for second arg of addInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.value + b.value))
    }
}
