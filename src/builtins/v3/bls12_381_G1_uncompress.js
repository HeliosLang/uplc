import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G1_element, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_uncompress = {
    name: "bls12_381_G1_uncompress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(211)),
    memModel: (params) => new ArgSizesConstCost(params.get(212)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for first arg of bls12_381_G1_uncompress`
            )
        }

        const bytes = a.bytes

        if (bytes.length != 48) {
            throw new Error(
                `expected ByteArray of length 48, got bytearray of length ${bytes.length}`
            )
        }

        return asCekValue(Bls12_381_G1_element.uncompress(a.bytes))
    }
}
