import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcList, UplcType, UplcUnit } from "../values/index.js"
import { asCekValue, asUplcValue } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkNilData = {
    name: "mkNilData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(108)),
    memModel: (params) => new ArgSizesConstCost(params.get(109)),
    call: (args, ctx) => {
        const a = asUplcValue(args[0])

        if (!(a instanceof UplcUnit)) {
            throw new Error(
                `expected a unit value for the first argument of mkNilData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcList(UplcType.data(), []))
    }
}
