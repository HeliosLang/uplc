import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcList } from "../values/index.js"
import { asUplcValue } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const chooseList = {
    name: "chooseList",
    forceCount: 2,
    nArgs: 3,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const list = asUplcValue(args[0])

        if (!(list instanceof UplcList)) {
            throw new Error(
                `expected as list as first argument of chooseList, got ${list?.toString()}`
            )
        }

        return list.length == 0 ? args[1] : args[2]
    }
}
