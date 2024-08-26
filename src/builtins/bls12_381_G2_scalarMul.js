import { G2 } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../costmodel/index.js"
import { Bls12_381_G2_element, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_scalarMul = {
    name: "bls12_381_G2_scalarMul",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(225), params.get(224)),
    memModel: (params) => new ArgSizesConstCost(params.get(226)),
    call: (args, ctx) => {
        const [n, a] = asUplcValues(args)

        if (!(n instanceof UplcInt)) {
            throw new Error(
                `expected UplcInt for first arg of bls12_381_G2_scalarMul`
            )
        }

        if (!(a instanceof Bls12_381_G2_element)) {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_G2_scalarMul`
            )
        }

        return asCekValue(new Bls12_381_G2_element(G2.scale(a.point, n.value)))
    }
}
