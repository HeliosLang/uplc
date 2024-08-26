import { decodeIntBE, decodeIntLE } from "@helios-lang/codec-utils"
import { ArgSizesQuadYCost, ArgSizesSecondCost } from "../costmodel/index.js"
import { UplcBool, UplcByteArray, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const byteStringToInteger = {
    name: "byteStringToInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesQuadYCost({
            c0: params.get(246),
            c1: params.get(247),
            c2: params.get(248)
        }),
    memModel: (params) =>
        new ArgSizesSecondCost(params.get(250), params.get(249)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcBool)) {
            throw new Error(
                `expected UplcBool for first arg of byteStringToInteger`
            )
        }

        if (!(b instanceof UplcByteArray)) {
            throw new Error(
                `expected UplcByteArray for second arg of byteStringToInteger`
            )
        }

        const res = a.value ? decodeIntBE(b.bytes) : decodeIntLE(b.bytes)

        return asCekValue(new UplcInt(res))
    }
}
