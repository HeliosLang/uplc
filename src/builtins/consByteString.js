import { ArgSizesSecondCost, ArgSizesSumCost } from "../costmodel/index.js"
import { UplcByteArray, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const consByteString = {
    name: "consByteString",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesSecondCost,
    MemModel: ArgSizesSumCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of consByteString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the second argument of consByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(
            new UplcByteArray([Number(a.value % 256n)].concat(b.bytes))
        )
    }
}
