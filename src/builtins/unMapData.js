import { ArgSizesConstCost } from "../costmodel/index.js"
import { MapData } from "../data/index.js"
import { UplcDataValue, UplcList, UplcPair, UplcType } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unMapData = {
    name: "unMapData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(183)),
    memModel: (params) => new ArgSizesConstCost(params.get(184)),
    call: (args, ctx) => {
        const [dataValue] = asUplcValues(args)

        if (!(dataValue instanceof UplcDataValue)) {
            throw new Error(
                `expected an data as first argument of unMapData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (!(data instanceof MapData)) {
            throw new Error(
                `expected MapData as first argument of unMapData, got ${data?.toString()}`
            )
        }

        return asCekValue(
            new UplcList(
                UplcType.dataPair(),
                data.items.map(
                    ([k, v]) =>
                        new UplcPair(new UplcDataValue(k), new UplcDataValue(v))
                )
            )
        )
    }
}
