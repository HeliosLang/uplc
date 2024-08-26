import { ArgSizesConstCost } from "../costmodel/index.js"
import { ConstrData } from "../data/index.js"
import {
    UplcDataValue,
    UplcInt,
    UplcList,
    UplcPair,
    UplcType
} from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unConstrData = {
    name: "unConstrData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(177)),
    memModel: (params) => new ArgSizesConstCost(params.get(178)),
    call: (args, ctx) => {
        const [dataValue] = asUplcValues(args)

        if (!(dataValue instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of unConstrData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (!(data instanceof ConstrData)) {
            throw new Error(
                `expected ConstrData as first argument of unConstrData, got ${data?.toString()}`
            )
        }

        return asCekValue(
            new UplcPair(
                new UplcInt(data.tag),
                new UplcList(
                    UplcType.data(),
                    data.fields.map((d) => new UplcDataValue(d))
                )
            )
        )
    }
}
