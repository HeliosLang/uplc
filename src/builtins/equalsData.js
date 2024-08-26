import { ArgSizesConstCost, ArgSizesMinCost } from "../costmodel/index.js"
import { UplcBool, UplcDataValue } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const equalsData = {
    name: "equalsData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesMinCost(params.get(69), params.get(68)),
    memModel: (params) => new ArgSizesConstCost(params.get(70)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of equalsData, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as second argument of equalsData, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcBool(a.value.isEqual(b.value)))
    }
}
