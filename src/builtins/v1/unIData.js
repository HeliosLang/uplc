import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unIData = {
    name: "unIData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(157)),
    memModel: (params) => makeArgSizesConstCost(params.get(158)),
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
