import { ArgSizesFirstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const serialiseData = {
    name: "serialiseData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(134), params.get(133)),
    memModel: (params) =>
        new ArgSizesFirstCost(params.get(136), params.get(135)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "data") {
            throw new Error(
                `expected a data value for the first argument of serialiseData, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(a.value.toCbor()))
    }
}
