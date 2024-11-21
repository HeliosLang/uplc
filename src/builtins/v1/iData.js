import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeIntData } from "../../data/index.js"
import { makeUplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const iData = {
    name: "iData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(77)),
    memModel: (params) => makeArgSizesConstCost(params.get(78)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer as the first argument of iData, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcDataValue(makeIntData(a.value)))
    }
}
