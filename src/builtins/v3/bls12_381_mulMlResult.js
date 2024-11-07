import { F12 } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_MlResult } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_mulMlResult = {
    name: "bls12_381_mulMlResult",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(233)),
    memModel: (params) => makeArgSizesConstCost(params.get(234)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_mlresult") {
            throw new Error(
                `expected Bls12_381_MlResult for first arg of bls12_381_mulMlResult`
            )
        }

        if (b?.kind != "bls12_381_mlresult") {
            throw new Error(
                `expected Bls12_381_MlResult for second arg of bls12_381_mulMlResult`
            )
        }

        const res = F12.multiply(a.element, b.element)

        return asCekValue(makeBls12_381_MlResult(res))
    }
}
