import { ArgSizesConstCost } from "../costmodel/index.js"
import { ByteArrayData } from "../../data/index.js"
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
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
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
