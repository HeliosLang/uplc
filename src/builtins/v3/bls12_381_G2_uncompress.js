import { ArgSizesConstCost } from "../../costmodel/index.js"
import { Bls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_uncompress = {
    name: "bls12_381_G2_uncompress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(227)),
    memModel: (params) => new ArgSizesConstCost(params.get(228)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for first arg of bls12_381_G2_uncompress`
            )
        }

        const bytes = a.bytes

        if (bytes.length != 96) {
            throw new Error(
                `expected ByteArray of length 96, got bytearray of length ${bytes.length}`
            )
        }

        return asCekValue(Bls12_381_G2_element.uncompress(a.bytes))
    }
}
