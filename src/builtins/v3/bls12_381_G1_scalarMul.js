import { G1 } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { Bls12_381_G1_element, UplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_scalarMul = {
    name: "bls12_381_G1_scalarMul",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(209), params.get(208)),
    memModel: (params) => new ArgSizesConstCost(params.get(210)),
    call: (args, ctx) => {
        const [n, a] = asUplcValues(args)

        if (n?.kind != "int") {
            throw new Error(
                `expected UplcInt for first arg of bls12_381_G1_scalarMul`
            )
        }

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for second arg of bls12_381_G1_scalarMul`
            )
        }

        return asCekValue(new Bls12_381_G1_element(G1.scale(a.point, n.value)))
    }
}
