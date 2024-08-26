import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcPair } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sndPair = {
    name: "sndPair",
    forceCount: 2,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(165)),
    memModel: (params) => new ArgSizesConstCost(params.get(166)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcPair)) {
            throw new Error(
                `expected a pair as first argument of sndPair, got ${a?.toString()}`
            )
        }

        return asCekValue(a.second)
    }
}
