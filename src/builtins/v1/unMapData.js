import { ArgSizesConstCost } from "../../costmodel/index.js"
import {
    UplcDataValue,
    UplcList,
    UplcPair,
    UplcType
} from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unMapData = {
    name: "unMapData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(161)),
    memModel: (params) => new ArgSizesConstCost(params.get(162)),
    call: (args, _ctx) => {
        const [dataValue] = asUplcValues(args)

        if (dataValue?.kind != "data") {
            throw new Error(
                `expected an data as first argument of unMapData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (data.kind != "map") {
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
