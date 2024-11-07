import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const sndPair = {
    name: "sndPair",
    forceCount: 2,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(143)),
    memModel: (params) => makeArgSizesConstCost(params.get(144)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "pair") {
            throw new Error(
                `expected a pair as first argument of sndPair, got ${a?.toString()}`
            )
        }

        return asCekValue(a.second)
    }
}
