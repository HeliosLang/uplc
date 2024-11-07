import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_compress = {
    name: "bls12_381_G2_compress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(215)),
    memModel: (params) => makeArgSizesConstCost(params.get(216)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_compress`
            )
        }

        return asCekValue(makeUplcByteArray(a.compress()))
    }
}
