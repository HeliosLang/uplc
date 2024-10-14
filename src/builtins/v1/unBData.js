import { ArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unBData = {
    name: "unBData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(153)),
    memModel: (params) => new ArgSizesConstCost(params.get(154)),
    call: (args, _ctx) => {
        const [dataValue] = asUplcValues(args)

        if (dataValue?.kind != "data") {
            throw new Error(
                `expected an data as first argument of unBData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (data.kind != "bytes") {
            throw new Error(
                `expected ByteArrayData as first argument of unBData, got ${data?.toString()}`
            )
        }

        return asCekValue(makeUplcByteArray(data.bytes))
    }
}
