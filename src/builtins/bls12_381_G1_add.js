import { G1 } from "@helios-lang/crypto"
import { ArgSizesConstCost } from "../costmodel/index.js"
import { Bls12_381_G1_element } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_add = {
    name: "bls12_381_G1_add",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(197)),
    memModel: (params) => new ArgSizesConstCost(params.get(198)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof Bls12_381_G1_element)) {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_G1_add`
            )
        }

        if (!(b instanceof Bls12_381_G1_element)) {
            throw new Error(
                `expected Bls12_381_G1_element for second arg of bls12_381_G1_add`
            )
        }

        const res = G1.add(a.point, b.point)

        return asCekValue(new Bls12_381_G1_element(res))
    }
}
