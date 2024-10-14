import { ArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcBool } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const nullList = {
    name: "nullList",
    forceCount: 1,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(119)),
    memModel: (params) => new ArgSizesConstCost(params.get(120)),
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
