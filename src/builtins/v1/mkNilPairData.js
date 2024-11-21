import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcList, DATA_PAIR_TYPE } from "../../values/index.js"
import { asCekValue, asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mkNilPairData = {
    name: "mkNilPairData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(105)),
    memModel: (params) => makeArgSizesConstCost(params.get(106)),
    call: (args, _ctx) => {
        const a = asUplcValue(args[0])

        if (a?.kind != "unit") {
            throw new Error(
                `expected a unit value for the first argument of mkNilPairData, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcList({ itemType: DATA_PAIR_TYPE, items: [] }))
    }
}
