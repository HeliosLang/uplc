import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcUnit } from "../values/index.js"
import { asUplcValue } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const chooseUnit = {
    name: "chooseUnit",
    forceCount: 1,
    nArgs: 2,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const a = asUplcValue(args[0])

        if (!(a instanceof UplcUnit)) {
            throw new Error(
                `expected a unit value for the first argument of chooseUnit, got ${a?.toString()}`
            )
        }

        return args[1]
    }
}
