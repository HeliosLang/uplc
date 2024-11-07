import { G2 } from "@helios-lang/crypto"
import {
    makeArgSizesConstCost,
    makeArgSizesFirstCost
} from "../../costmodel/index.js"
import { makeBls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_scalarMul = {
    name: "bls12_381_G2_scalarMul",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesFirstCost(params.get(225), params.get(224)),
    memModel: (params) => makeArgSizesConstCost(params.get(226)),
    call: (args, _ctx) => {
        const [n, a] = asUplcValues(args)

        if (n?.kind != "int") {
            throw new Error(
                `expected UplcInt for first arg of bls12_381_G2_scalarMul`
            )
        }

        if (a?.kind != "bls12_381_G2_element") {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_G2_scalarMul`
            )
        }

        return asCekValue(makeBls12_381_G2_element(G2.scale(a.point, n.value)))
    }
}
