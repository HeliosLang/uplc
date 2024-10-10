import { blake2b as hash } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const blake2b_224 = {
    name: "blake2b_224",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(239), params.get(238)),
    memModel: (params) => new ArgSizesConstCost(params.get(240)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of blake2b_224, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(hash(a.bytes, 28)))
    }
}
