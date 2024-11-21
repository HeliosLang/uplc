import { finalVerify } from "@helios-lang/crypto"
import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_finalVerify = {
    name: "bls12_381_finalVerify",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(229)),
    memModel: (params) => makeArgSizesConstCost(params.get(230)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bls12_381_mlresult") {
            throw new Error(
                `expected Bls12_381_MlResult for first arg of bls12_381_finalVerify`
            )
        }

        if (b?.kind != "bls12_381_mlresult") {
            throw new Error(
                `expected Bls12_381_MlResult for second arg of bls12_381_finalVerify`
            )
        }

        const res = finalVerify(a.element, b.element)

        return asCekValue(makeUplcBool(res))
    }
}
