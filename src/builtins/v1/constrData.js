import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeConstrData } from "../../data/index.js"
import { makeUplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const constrData = {
    name: "constrData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => makeArgSizesConstCost(params.get(43)),
    memModel: (params) => makeArgSizesConstCost(params.get(44)),
    call: (args, _ctx) => {
        const [tag, fields] = asUplcValues(args)

        if (tag?.kind != "int") {
            throw new Error(
                `expected an integer as first argument of constrData, got ${tag?.toString()}`
            )
        }

        if (fields?.kind != "list") {
            throw new Error(
                `expected a list as second argument of constrData, got ${fields?.toString()}`
            )
        }

        if (!fields.isDataList()) {
            throw new Error("second argument of constrData is not a data list")
        }

        return asCekValue(
            makeUplcDataValue(
                makeConstrData(
                    tag.value,
                    fields.items.map((f) => {
                        if (f.kind == "data") {
                            return f.value
                        } else {
                            throw new Error("expected only data value fields")
                        }
                    })
                )
            )
        )
    }
}
