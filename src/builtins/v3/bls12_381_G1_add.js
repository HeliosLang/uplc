import { G1 } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_G1_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_add = {
    name: "bls12_381_G1_add",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(197)),
    memModel: (params) => makeArgSizesConstCost(params.get(198)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_G1_add`
            )
        }

        if (b?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for second arg of bls12_381_G1_add`
            )
        }

        const res = G1.add(a.point, b.point)

        return asCekValue(makeBls12_381_G1_element(res))
    }
}
