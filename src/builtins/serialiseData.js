import { ArgSizesFirstCost } from "../costmodel/index.js"
import { UplcByteArray, UplcDataValue } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const serialiseData = {
    name: "serialiseData",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesFirstCost,
    MemModel: ArgSizesFirstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcDataValue)) {
            throw new Error(
                `expected a data value for the first argument of serialiseData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(a.value.toCbor()))
    }
}
