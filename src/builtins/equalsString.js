import { ArgSizesConstCost, ArgSizesDiagCost } from "../costmodel/index.js"
import { UplcBool, UplcString } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsString = {
    name: "equalsString",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesDiagCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcString)) {
            throw new Error(
                `expected a string for the first argument of equalsString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcString)) {
            throw new Error(
                `expected a string for the second argument of equalsString, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value == b.value))
    }
}
