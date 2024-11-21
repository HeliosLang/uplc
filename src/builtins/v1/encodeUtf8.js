import { encodeUtf8 as encode } from "@helios-lang/codec-utils"
import { makeArgSizesFirstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const encodeUtf8 = {
    name: "encodeUtf8",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesFirstCost(params.get(56), params.get(55)),
    memModel: (params) => makeArgSizesFirstCost(params.get(58), params.get(57)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "string") {
            throw new Error(
                `expected a string for the first argument of encodeUtf8, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(encode(a.value)))
    }
}
