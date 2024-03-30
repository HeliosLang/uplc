import { ArgSizesSumCost } from "../costmodel/index.js"
import { UplcString } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const appendString = {
    name: "appendString",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesSumCost,
    MemModel: ArgSizesSumCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcString)) {
            throw new Error(
                `expected a string for the first argument of appendString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcString)) {
            throw new Error(
                `expected a string for the second argument of appendString, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcString(a.value + b.value))
    }
}
