import { ArgSizesConstCost, ArgSizesMinCost } from "../../costmodel/index.js"
import { ByteArrayData } from "../../data/index.js"
import { UplcBool, UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsByteString = {
    name: "lessThanEqualsByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(89), params.get(88)),
    memModel: (params) => new ArgSizesConstCost(params.get(90)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of lessThanEqualsByteString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the second argument of lessThanEqualsByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            new UplcBool(ByteArrayData.compare(a.bytes, b.bytes) <= 0)
        )
    }
}
