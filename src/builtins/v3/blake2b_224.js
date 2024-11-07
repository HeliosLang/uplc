import { blake2b as hash } from "@helios-lang/crypto"
import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const blake2b_224 = {
    name: "blake2b_224",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(239), params.get(238)),
    memModel: (params) => makeArgSizesConstCost(params.get(240)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of blake2b_224, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(hash(a.bytes, 28)))
    }
}
