import { decodeUtf8 as decode } from "@helios-lang/codec-utils"
import { makeArgSizesFirstCost } from "../../costmodel/index.js"
import { makeUplcString } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const decodeUtf8 = {
    name: "decodeUtf8",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesFirstCost(params.get(46), params.get(45)),
    memModel: (params) => makeArgSizesFirstCost(params.get(48), params.get(47)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of decodeUtf8, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcString(decode(a.bytes)))
    }
}
