import { keccak_256 as hash } from "@helios-lang/crypto"
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
export const keccak_256 = {
    name: "keccak_256",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(236), params.get(235)),
    memModel: (params) => makeArgSizesConstCost(params.get(237)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of keccak_256, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(hash(a.bytes)))
    }
}
