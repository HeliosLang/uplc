import { ArgSizesConstCost } from "../costmodel/index.js"
import { ByteArrayData } from "../data/index.js"
import { UplcByteArray, UplcDataValue } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bData = {
    name: "bData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(12)),
    memModel: (params) => new ArgSizesConstCost(params.get(13)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array as the first argument of bData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcDataValue(new ByteArrayData(a.bytes)))
    }
}
