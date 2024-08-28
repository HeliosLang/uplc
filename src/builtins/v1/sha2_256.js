import { sha2_256 as hash } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sha2_256 = {
    name: "sha2_256",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(134), params.get(133)),
    memModel: (params) => new ArgSizesConstCost(params.get(135)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of sha2_256, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(hash(a.bytes)))
    }
}
