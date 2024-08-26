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
export const lessThanInteger = {
    name: "lessThanInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(100), params.get(99)),
    memModel: (params) => new ArgSizesConstCost(params.get(101)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of lessThanInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of lessThanInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value < b.value))
    }
}
