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
    cpuModel: (params) =>
        new ArgSizesDiagCost(params.get(76), params.get(75), params.get(74)),
    memModel: (params) => new ArgSizesConstCost(params.get(77)),
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
