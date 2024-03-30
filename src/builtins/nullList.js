import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcBool, UplcList } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const nullList = {
    name: "nullList",
    forceCount: 1,
    nArgs: 1,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [list] = asUplcValues(args)

        if (!(list instanceof UplcList)) {
            throw new Error(
                `expected list as first argument of nullList, got ${list?.toString()}`
            )
        }

        return asCekValue(new UplcBool(list.length == 0))
    }
}
