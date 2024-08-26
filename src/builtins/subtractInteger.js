import { ArgSizesMaxCost } from "../costmodel/index.js"
import { UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const subtractInteger = {
    name: "subtractInteger",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMaxCost(params.get(168), params.get(167)),
    memModel: (params) => new ArgSizesMaxCost(params.get(170), params.get(169)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected integer for first arg of subtractInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected integer for second arg of subtractInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.value - b.value))
    }
}
