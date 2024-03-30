import { ArgSizesConstCost, ArgSizesDiagCost } from "../costmodel/index.js"
import { ByteArrayData } from "../data/index.js"
import { UplcBool, UplcByteArray } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsByteString = {
    name: "equalsByteString",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesDiagCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of equalsByteString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the second argument of equalsByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            new UplcBool(ByteArrayData.compare(a.bytes, b.bytes) == 0)
        )
    }
}
