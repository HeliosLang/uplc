import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcPair } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const fstPair = {
    name: "fstPair",
    forceCount: 2,
    nArgs: 1,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcPair)) {
            throw new Error(
                `expected a pair as first argument of fstPair, got ${a?.toString()}`
            )
        }

        return asCekValue(a.first)
    }
}
