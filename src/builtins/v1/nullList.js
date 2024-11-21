import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const nullList = {
    name: "nullList",
    forceCount: 1,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(119)),
    memModel: (params) => makeArgSizesConstCost(params.get(120)),
    call: (args, _ctx) => {
        const [list] = asUplcValues(args)

        if (list?.kind != "list") {
            throw new Error(
                `expected list as first argument of nullList, got ${list?.toString()}`
            )
        }

        return asCekValue(makeUplcBool(list.length == 0))
    }
}
