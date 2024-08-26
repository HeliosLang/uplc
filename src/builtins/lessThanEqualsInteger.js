import {
    ArgSizesConstCost,
    ArgSizesDiffCost,
    ArgSizesMinCost
} from "../costmodel/index.js"
import { UplcBool, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lessThanEqualsInteger = {
    name: "lessThanEqualsInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(97), params.get(96)),
    memModel: (params) => new ArgSizesConstCost(params.get(98)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of lessThanEqualsInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of lessThanEqualsInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value <= b.value))
    }
}
