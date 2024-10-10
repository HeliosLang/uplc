import { ArgSizesConstCost } from "../../costmodel/index.js"
import { IntData } from "../../data/index.js"
import { UplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const iData = {
    name: "iData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(77)),
    memModel: (params) => new ArgSizesConstCost(params.get(78)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "int") {
            throw new Error(
                `expected an integer as the first argument of iData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcDataValue(new IntData(a.value)))
    }
}
