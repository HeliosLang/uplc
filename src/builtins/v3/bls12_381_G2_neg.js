import { G2 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_neg = {
    name: "bls12_381_G2_neg",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(222)),
    memModel: (params) => new ArgSizesConstCost(params.get(223)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_neg`
            )
        }

        return asCekValue(new Bls12_381_G2_element(G2.negate(a.point)))
    }
}
