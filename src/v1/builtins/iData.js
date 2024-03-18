import { ArgSizesConstCost } from "../costmodel/index.js"
import { IntData } from "../../data/index.js"
import { UplcDataValue, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const iData = {
    name: "iData",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcInt)) {
            throw new Error(
                `expected an integer as the first argument of iData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcDataValue(new IntData(a.value)))
    }
}
