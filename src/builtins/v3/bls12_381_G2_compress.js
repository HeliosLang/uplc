import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G2_element, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_compress = {
    name: "bls12_381_G2_compress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(215)),
    memModel: (params) => new ArgSizesConstCost(params.get(216)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof Bls12_381_G2_element)) {
            throw new Error(
                `expected Bls12_381_G2_element for first arg of bls12_381_G2_compress`
            )
        }

        return asCekValue(new UplcByteArray(a.compress()))
    }
}
