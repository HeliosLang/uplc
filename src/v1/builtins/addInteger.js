import { ArgSizesMaxCost } from "../costmodel/index.js"
import { UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const addInteger = {
    name: "addInteger",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesMaxCost,
    MemModel: ArgSizesMaxCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected integer for first arg of addInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected integer for second arg of addInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.value + b.value))
    }
}
