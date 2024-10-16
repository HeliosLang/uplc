import { ArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unIData = {
    name: "unIData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(157)),
    memModel: (params) => new ArgSizesConstCost(params.get(158)),
    call: (args, _ctx) => {
        const [dataValue] = asUplcValues(args)

        if (dataValue?.kind != "data") {
            throw new Error(
                `expected an data as first argument of unIData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (data.kind != "int") {
            throw new Error(
                `expected IntData as first argument of unIData, got ${data?.toString()}`
            )
        }

        return asCekValue(makeUplcInt(data.value))
    }
}
