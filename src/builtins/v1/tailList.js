import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcList } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const tailList = {
    name: "tailList",
    forceCount: 1,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(149)),
    memModel: (params) => makeArgSizesConstCost(params.get(150)),
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

        return asCekValue(
            makeUplcList({
                itemType: list.itemType,
                items: list.items.slice(1)
            })
        )
    }
}
