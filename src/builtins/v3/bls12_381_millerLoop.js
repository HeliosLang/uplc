import { G1, G2, millerLoop } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_MlResult } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_millerLoop = {
    name: "bls12_381_millerLoop",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(231)),
    memModel: (params) => makeArgSizesConstCost(params.get(232)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_millerLoop`
            )
        }

        if (b?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_millerLoop`
            )
        }

        const elem = millerLoop(G1.toAffine(a.point), G2.toAffine(b.point))

        return asCekValue(makeBls12_381_MlResult(elem))
    }
}
