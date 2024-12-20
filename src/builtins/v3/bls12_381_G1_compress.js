import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_compress = {
    name: "bls12_381_G1_compress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(199)),
    memModel: (params) => makeArgSizesConstCost(params.get(200)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bls12_381_G1_element") {
            throw new Error(
                `expected Bls12_381_G1_element for first arg of bls12_381_G1_compress`
            )
        }

        return asCekValue(makeUplcByteArray(a.compress()))
    }
}
