import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcList } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const tailList = {
    name: "tailList",
    forceCount: 1,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(149)),
    memModel: (params) => new ArgSizesConstCost(params.get(150)),
    call: (args, _ctx) => {
        const [list] = asUplcValues(args)

        if (list?.kind != "list") {
            throw new Error(
                `expected list as first argument of tailList, got ${list?.toString()}`
            )
        }

        if (list.length == 0) {
            throw new Error("empty list in tailList")
        }

        return asCekValue(new UplcList(list.itemType, list.items.slice(1)))
    }
}
