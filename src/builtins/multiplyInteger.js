import { ArgSizesSumCost } from "../costmodel/index.js"
import { UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const multiplyInteger = {
    name: "multiplyInteger",
    forceCount: 0,
    nArgs: 2,
    CpuModel: ArgSizesSumCost,
    MemModel: ArgSizesSumCost,
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the first argument of multiplyInteger, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcInt)) {
            throw new Error(
                `expected an integer for the second argument of multiplyInteger, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.value * b.value))
    }
}
