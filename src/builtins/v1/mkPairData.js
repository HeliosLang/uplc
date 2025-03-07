import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcPair } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mkPairData = {
    name: "mkPairData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(107)),
    memModel: (params) => makeArgSizesConstCost(params.get(108)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "data") {
            throw new Error(
                `expected an data as first argument of mkPairData, got ${a?.toString()}`
            )
        }

        if (b?.kind != "data") {
            throw new Error(
                `expected an data as second argument of mkPairData, got ${b?.toString()}`
            )
        }

        return asCekValue(makeUplcPair({ first: a, second: b }))
    }
}
