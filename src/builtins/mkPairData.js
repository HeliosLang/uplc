import { ArgSizesConstCost } from "../costmodel/index.js"
import { IntData } from "../data/index.js"
import { UplcBool, UplcDataValue, UplcInt, UplcPair } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkPairData = {
    name: "mkPairData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(112)),
    memModel: (params) => new ArgSizesConstCost(params.get(113)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of mkPairData, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as second argument of mkPairData, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcPair(a, b))
    }
}
