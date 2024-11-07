import { hashToG1 } from "@helios-lang/crypto"
import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { makeBls12_381_G1_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_hashToGroup = {
    name: "bls12_381_G1_hashToGroup",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(204), params.get(203)),
    memModel: (params) => makeArgSizesConstCost(params.get(205)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for first arg of bls12_381_G1_hashToGroup`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for second arg of bls12_381_G1_hashToGroup`
            )
        }

        const point = hashToG1(a.bytes, b.bytes)

        return asCekValue(makeBls12_381_G1_element(point))
    }
}
