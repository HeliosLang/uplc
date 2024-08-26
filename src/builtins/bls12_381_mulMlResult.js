/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

import { F12 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../costmodel/index.js"
import { Bls12_381_MlResult } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @type {Builtin}
 */
export const bls12_381_mulMlResult = {
    name: "bls12_381_mulMlResult",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(233)),
    memModel: (params) => new ArgSizesConstCost(params.get(234)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof Bls12_381_MlResult)) {
            throw new Error(
                `expected Bls12_381_MlResult for first arg of bls12_381_mulMlResult`
            )
        }

        if (!(b instanceof Bls12_381_MlResult)) {
            throw new Error(
                `expected Bls12_381_MlResult for second arg of bls12_381_mulMlResult`
            )
        }

        const res = F12.multiply(a.element, b.element)

        return asCekValue(new Bls12_381_MlResult(res))
    }
}
