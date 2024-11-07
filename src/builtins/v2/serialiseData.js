import { makeArgSizesFirstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const serialiseData = {
    name: "serialiseData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(134), params.get(133)),
    memModel: (params) =>
        makeArgSizesFirstCost(params.get(136), params.get(135)),
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
