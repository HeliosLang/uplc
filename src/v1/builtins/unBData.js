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
export const unBData = {
    name: "unBData",
    forceCount: 0,
    nArgs: 1,
    CpuModel: ArgSizesConstCost,
    MemModel: ArgSizesConstCost,
    call: (args, ctx) => {
        const [dataValue] = asUplcValues(args)

        if (!(dataValue instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of unBData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (!(data instanceof ByteArrayData)) {
            throw new Error(
                `expected ByteArrayData as first argument of unBData, got ${data?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(data.bytes))
    }
}
