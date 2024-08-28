import { G2 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G2_element, UplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_equal = {
    name: "bls12_381_G2_equal",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(217)),
    memModel: (params) => new ArgSizesConstCost(params.get(218)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_equal`
            )
        }

        if (b?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_G2_equal`
            )
        }

        const res = G2.equals(a.point, b.point)

        return asCekValue(new UplcBool(res))
    }
}
