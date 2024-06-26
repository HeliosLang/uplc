import { ArgSizesProdCost, ArgSizesDiffCost } from "../costmodel/index.js"
import { UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const remainederInteger = {
    name: "remainderInteger",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesProdCost,
    MemModel: ArgSizesDiffCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of remainederInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of remainederInteger, got ${b?.toString()}`
            )
        }

        if (b.value === 0n) {
            throw new Error(`division by 0 in remainederInteger`)
        }

        return asCekValue(
            new UplcInt(
                a.value % b.value
                //a.value -
                //  (a.value / b.value + (b.value < 0n ? 1n : 0n)) * b.value
            )
        )
    }
}
