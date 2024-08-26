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
export const equalsInteger = {
    name: "equalsInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(72), params.get(71)),
    memModel: (params) => new ArgSizesConstCost(params.get(73)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of equalsInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of equalsInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value == b.value))
    }
}
