import { ArgSizesConstCost } from "../costmodel/index.js"
import { IntData } from "../data/index.js"
import { UplcDataValue, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unIData = {
    name: "unIData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(179)),
    memModel: (params) => new ArgSizesConstCost(params.get(180)),
    call: (args, ctx) => {
        const [dataValue] = asUplcValues(args)

        if (!(dataValue instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of unIData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (!(data instanceof IntData)) {
            throw new Error(
                `expected IntData as first argument of unIData, got ${data?.toString()}`
            )
        }

        return asCekValue(new UplcInt(data.value))
    }
}
