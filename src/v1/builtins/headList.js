import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcList } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const headList = {
    name: "headList",
    forceCount: 1,
    nArgs: 1,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [list] = asUplcValues(args)

        if (!(list instanceof UplcList)) {
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
