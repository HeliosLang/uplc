import { decodeUtf8 as decode } from "@helios-lang/codec-utils"
import { ArgSizesFirstCost } from "../costmodel/index.js"
import { UplcByteArray, UplcString } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const decodeUtf8 = {
    name: "decodeUtf8",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesFirstCost,
    MemModel: ArgSizesFirstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of decodeUtf8, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcString(decode(a.value)))
    }
}
