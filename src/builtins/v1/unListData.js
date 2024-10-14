import { ArgSizesConstCost } from "../../costmodel/index.js"
import {
    DATA_TYPE,
    makeUplcDataValue,
    makeUplcList
} from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const unListData = {
    name: "unListData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(159)),
    memModel: (params) => new ArgSizesConstCost(params.get(160)),
    call: (args, _ctx) => {
        const [dataValue] = asUplcValues(args)

        if (dataValue?.kind != "data") {
            throw new Error(
                `expected an data as first argument of unListData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (data.kind != "list") {
            throw new Error(
                `expected ListData as first argument of unListData, got ${data?.toString()}`
            )
        }

        return asCekValue(
            makeUplcList({
                itemType: DATA_TYPE,
                items: data.items.map(makeUplcDataValue)
            })
        )
    }
}
