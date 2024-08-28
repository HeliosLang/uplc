import { hashToG2 } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { Bls12_381_G2_element, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_hashToGroup = {
    name: "bls12_381_G2_hashToGroup",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(220), params.get(219)),
    memModel: (params) => new ArgSizesConstCost(params.get(221)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for first arg of bls12_381_G2_hashToGroup`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for second arg of bls12_381_G2_hashToGroup`
            )
        }

        const point = hashToG2(a.bytes, b.bytes)

        return asCekValue(new Bls12_381_G2_element(point))
    }
}
