import { sha3_256 as hash } from "@helios-lang/crypto"
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
 */
export const sha3_256 = {
    name: "sha3_256",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(137), params.get(136)),
    memModel: (params) => makeArgSizesConstCost(params.get(138)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of sha3_256, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(hash(a.bytes)))
    }
}
