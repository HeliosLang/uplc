import { G1 } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_equal = {
    name: "bls12_381_G1_equal",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(201)),
    memModel: (params) => makeArgSizesConstCost(params.get(202)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_G1_equal`
            )
        }

        if (b?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for second arg of bls12_381_G1_equal`
            )
        }

        const res = G1.equals(a.point, b.point)

        return asCekValue(makeUplcBool(res))
    }
}
