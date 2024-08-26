import { sha2_256 as hash } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../costmodel/index.js"
import { UplcByteArray } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sha2_256 = {
    name: "sha2_256",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(156), params.get(155)),
    memModel: (params) => new ArgSizesConstCost(params.get(157)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of sha2_256, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(hash(a.bytes)))
    }
}
