import { makeArgSizesSumCost } from "../../costmodel/index.js"
import { makeUplcString } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const appendStringV1 = {
    name: "appendString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesSumCost(params.get(9), params.get(8)),
    memModel: (params) => makeArgSizesSumCost(params.get(11), params.get(10)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "string") {
            throw new Error(
                `expected a string for the first argument of appendString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "string") {
            throw new Error(
                `expected a string for the second argument of appendString, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcString(a.value + b.value))
    }
}
