import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeBls12_381_G1_element } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const bls12_381_G1_uncompress = {
    name: "bls12_381_G1_uncompress",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(211)),
    memModel: (params) => makeArgSizesConstCost(params.get(212)),
    call: (args, _ctx) => {
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

        return asCekValue(makeBls12_381_G1_element({ bytes: a.bytes }))
    }
}
