import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_G2_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G2_uncompress = {
    name: "bls12_381_G2_uncompress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(227)),
    memModel: (params) => makeArgSizesConstCost(params.get(228)),
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

        return asCekValue(makeBls12_381_G2_element({ bytes: a.bytes }))
    }
}
