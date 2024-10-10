import { decodeUtf8 as decode } from "@helios-lang/codec-utils"
import { ArgSizesFirstCost } from "../../costmodel/index.js"
import { UplcString } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const decodeUtf8 = {
    name: "decodeUtf8",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesFirstCost(params.get(46), params.get(45)),
    memModel: (params) => new ArgSizesFirstCost(params.get(48), params.get(47)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of decodeUtf8, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcString(decode(a.bytes)))
    }
}
