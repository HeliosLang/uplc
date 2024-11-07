import { makeArgSizesConstCost } from "../../costmodel/index.js"
import {
    DATA_PAIR_TYPE,
    makeUplcDataValue,
    makeUplcList,
    makeUplcPair
} from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "src/index.js"
 */

/**
 * @type {Builtin}
 */
export const unMapData = {
    name: "unMapData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(161)),
    memModel: (params) => makeArgSizesConstCost(params.get(162)),
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
            makeUplcList({
                itemType: DATA_PAIR_TYPE,
                items: data.items.map(([k, v]) =>
                    makeUplcPair({
                        first: makeUplcDataValue(k),
                        second: makeUplcDataValue(v)
                    })
                )
            })
        )
    }
}
