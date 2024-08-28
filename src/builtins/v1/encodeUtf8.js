import { encodeUtf8 as encode } from "@helios-lang/codec-utils"
import { ArgSizesFirstCost } from "../../costmodel/index.js"
import { UplcByteArray, UplcString } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const encodeUtf8 = {
    name: "encodeUtf8",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesFirstCost(params.get(56), params.get(55)),
    memModel: (params) => new ArgSizesFirstCost(params.get(58), params.get(57)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "string") {
            throw new Error(
                `expected a string for the first argument of encodeUtf8, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(encode(a.value)))
    }
}
