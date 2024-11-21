import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const chooseList = {
    name: "chooseList",
    forceCount: 2,
    nArgs: 3,
    cpuModel: (params) => makeArgSizesConstCost(params.get(35)),
    memModel: (params) => makeArgSizesConstCost(params.get(36)),
    call: (args, _ctx) => {
        const list = asUplcValue(args[0])

        if (list?.kind != "list") {
            throw new Error(
                `expected a list as first argument of chooseList, got ${list?.toString()}`
            )
        }

        return list.length == 0 ? args[1] : args[2]
    }
}
