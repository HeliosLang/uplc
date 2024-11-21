import { blake2b as hash } from "@helios-lang/crypto"
import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const blake2b_256 = {
    name: "blake2b_256",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesFirstCost(params.get(15), params.get(14)),
    memModel: (params) => makeArgSizesConstCost(params.get(16)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of blake2b_256, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(hash(a.bytes)))
    }
}
