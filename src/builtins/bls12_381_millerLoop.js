import { G1, G2, millerLoop } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../costmodel/index.js"
import {
    Bls12_381_G1_element,
    Bls12_381_G2_element,
    Bls12_381_MlResult
} from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_millerLoop = {
    name: "bls12_381_millerLoop",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(231)),
    memModel: (params) => new ArgSizesConstCost(params.get(232)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof Bls12_381_G1_element)) {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_millerLoop`
            )
        }

        if (!(b instanceof Bls12_381_G2_element)) {
            throw new Error(
                `expected Bls12_381_G2_element for second arg of bls12_381_millerLoop`
            )
        }

        const elem = millerLoop(G1.toAffine(a.point), G2.toAffine(b.point))

        return asCekValue(new Bls12_381_MlResult(elem))
    }
}
