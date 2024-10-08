import { ArgSizesConstCost } from "../../costmodel/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const chooseList = {
    name: "chooseList",
    forceCount: 2,
    nArgs: 3,
    cpuModel: (params) => new ArgSizesConstCost(params.get(35)),
    memModel: (params) => new ArgSizesConstCost(params.get(36)),
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
