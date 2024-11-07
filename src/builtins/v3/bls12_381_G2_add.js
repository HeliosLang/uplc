import { G2 } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_add = {
    name: "bls12_381_G2_add",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(213)),
    memModel: (params) => makeArgSizesConstCost(params.get(214)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_add`
            )
        }

        if (b?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_G2_add`
            )
        }

        const res = G2.add(a.point, b.point)

        return asCekValue(makeBls12_381_G2_element(res))
    }
}
