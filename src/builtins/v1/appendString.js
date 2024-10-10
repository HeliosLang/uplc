import { ArgSizesSumCost } from "../../costmodel/index.js"
import { UplcString } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const appendStringV1 = {
    name: "appendString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesSumCost(params.get(9), params.get(8)),
    memModel: (params) => new ArgSizesSumCost(params.get(11), params.get(10)),
    call: (args, _ctx) => {
        const [a, b] = asUplcValues(args)

        if (a?.kind != "string") {
            throw new Error(
                `expected a string for the first argument of appendString, got ${a?.toString()}`
            )
        }

        if (b?.kind != "string") {
            throw new Error(
                `expected a string for the second argument of appendString, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcString(a.value + b.value))
    }
}
