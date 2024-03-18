import { ArgSizesThirdCost } from "../costmodel/index.js"
import { UplcByteArray, UplcInt } from "../values/index.js"
import { asCekValue } from "./cast.js"
import { asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sliceByteString = {
    name: "sliceByteString",
    forceCount: 0,
    nArgs: 3,
    CpuModel: ArgSizesThirdCost,
    MemModel: ArgSizesThirdCost,
    call: (args, ctx) => {
        const [a, b, c] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of sliceByteString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of sliceByteString, got ${b?.toString()}`
            )
        }

        if (!(c instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the third argument of sliceByteString, got ${c?.toString()}`
            )
        }

        const bytes = c.value
        const start = Math.max(Number(a.value), 0)
        const end = Math.min(
            Number(a.value) + Number(b.value) - 1,
            bytes.length - 1
        )

        const res = end < start ? [] : bytes.slice(start, end + 1)

        return asCekValue(new UplcByteArray(res))
    }
}
