import { decodeIntBE, decodeIntLE } from "@helios-lang/codec-utils"
import {
    makeArgSizesQuadYCost,
    makeArgSizesSecondCost
} from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const byteStringToInteger = {
    name: "byteStringToInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        makeArgSizesQuadYCost({
            c0: params.get(246),
            c1: params.get(247),
            c2: params.get(248)
        }),
    memModel: (params) =>
        makeArgSizesSecondCost(params.get(250), params.get(249)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bool") {
            throw new Error(
                `expected UplcBool for first arg of byteStringToInteger`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected UplcByteArray for second arg of byteStringToInteger`
            )
        }

        const res = a.value ? decodeIntBE(b.bytes) : decodeIntLE(b.bytes)

        return asCekValue(makeUplcInt(res))
    }
}
