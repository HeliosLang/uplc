import { ArgSizesConstCost, ArgSizesDiagCost } from "../../costmodel/index.js"
import { ByteArrayData } from "../../data/index.js"
import { UplcBool, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsByteString = {
    name: "equalsByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) =>
        new ArgSizesDiagCost(params.get(61), params.get(60), params.get(59)),
    memModel: (params) => new ArgSizesConstCost(params.get(62)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of equalsByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of equalsByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            new UplcBool(ByteArrayData.compare(a.bytes, b.bytes) == 0)
        )
    }
}
