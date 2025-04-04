import { makeArgSizesConstCost } from "../../costmodel/index.js"
import {
    DATA_TYPE,
    makeUplcDataValue,
    makeUplcInt,
    makeUplcList,
    makeUplcPair
} from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const unConstrData = {
    name: "unConstrData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(155)),
    memModel: (params) => makeArgSizesConstCost(params.get(156)),
    call: (args, _ctx) => {
        const [dataValue] = asUplcValues(args)

        if (dataValue?.kind != "data") {
            throw new Error(
                `expected an data as first argument of unConstrData, got ${dataValue?.toString()}`
            )
        }

        const data = dataValue.value

        if (data.kind != "constr") {
            throw new Error(
                `expected ConstrData as first argument of unConstrData, got ${data?.toString()}`
            )
        }

        return asCekValue(
            makeUplcPair({
                first: makeUplcInt(data.tag),
                second: makeUplcList({
                    itemType: DATA_TYPE,
                    items: data.fields.map(makeUplcDataValue)
                })
            })
        )
    }
}
