import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const fstPair = {
    name: "fstPair",
    forceCount: 2,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(73)),
    memModel: (params) => makeArgSizesConstCost(params.get(74)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "pair") {
            throw new Error(
                `expected a pair as first argument of fstPair, got ${a?.toString()}`
            )
        }

        return asCekValue(a.first)
    }
}
