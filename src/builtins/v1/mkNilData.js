import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcList, DATA_TYPE } from "../../values/index.js"
import { asCekValue, asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const mkNilData = {
    name: "mkNilData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(103)),
    memModel: (params) => makeArgSizesConstCost(params.get(104)),
    call: (args, _ctx) => {
        const a = asUplcValue(args[0])

        if (a?.kind != "unit") {
            throw new Error(
                `expected a unit value for the first argument of mkNilData, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcList({ itemType: DATA_TYPE, items: [] }))
    }
}
