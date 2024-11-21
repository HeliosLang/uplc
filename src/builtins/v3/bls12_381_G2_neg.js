import { G2 } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_neg = {
    name: "bls12_381_G2_neg",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(222)),
    memModel: (params) => makeArgSizesConstCost(params.get(223)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_neg`
            )
        }

        return asCekValue(makeBls12_381_G2_element(G2.negate(a.point)))
    }
}
