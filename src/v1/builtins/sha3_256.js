import { sha3_256 as hash } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../costmodel/index.js"
import { UplcByteArray } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sha3_256 = {
    name: "sha3_256",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesFirstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of sha3_256, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(hash(a.value)))
    }
}
