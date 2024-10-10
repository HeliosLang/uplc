import { G1 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G1_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_neg = {
    name: "bls12_381_G1_neg",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(206)),
    memModel: (params) => new ArgSizesConstCost(params.get(207)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_G1_neg`
            )
        }

        return asCekValue(new Bls12_381_G1_element(G1.negate(a.point)))
    }
}
