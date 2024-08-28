import { hashToG1 } from "@helios-lang/crypto"
import { ArgSizesConstCost, ArgSizesFirstCost } from "../../costmodel/index.js"
import { Bls12_381_G1_element, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_hashToGroup = {
    name: "bls12_381_G1_hashToGroup",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesFirstCost(params.get(204), params.get(203)),
    memModel: (params) => new ArgSizesConstCost(params.get(205)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for first arg of bls12_381_G1_hashToGroup`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for second arg of bls12_381_G1_hashToGroup`
            )
        }

        const point = hashToG1(a.bytes, b.bytes)

        return asCekValue(new Bls12_381_G1_element(point))
    }
}
