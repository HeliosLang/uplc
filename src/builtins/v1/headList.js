import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcList } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const headList = {
    name: "headList",
    forceCount: 1,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(75)),
    memModel: (params) => new ArgSizesConstCost(params.get(76)),
    call: (args, ctx) => {
        const [list] = asUplcValues(args)

        if (list?.kind != "list") {
            throw new Error(
                `expected list as first argument of headList, got ${list?.toString()}`
            )
        }

        if (list.length == 0) {
            throw new Error("empty list in headList")
        }

        return asCekValue(list.items[0])
    }
}
