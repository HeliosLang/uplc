import { finalVerify } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../costmodel/index.js"
import { Bls12_381_MlResult, UplcBool } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_finalVerify = {
    name: "bls12_381_finalVerify",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(229)),
    memModel: (params) => new ArgSizesConstCost(params.get(230)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof Bls12_381_MlResult)) {
            throw new Error(
                `expected Bls12_381_MlResult for first arg of bls12_381_finalVerify`
            )
        }

        if (!(b instanceof Bls12_381_MlResult)) {
            throw new Error(
                `expected Bls12_381_MlResult for second arg of bls12_381_finalVerify`
            )
        }

        const res = finalVerify(a.element, b.element)

        return asCekValue(new UplcBool(res))
    }
}
