import { blake2b as hash } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../costmodel/index.js"
import { UplcByteArray } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const blake2b_256 = {
    name: "blake2b_256",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesFirstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of blake2b_256, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(hash(a.bytes)))
    }
}
