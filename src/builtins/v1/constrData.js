import { ArgSizesConstCost } from "../../costmodel/index.js"
import { ConstrData } from "../../data/index.js"
import { UplcDataValue, UplcInt, UplcList } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const constrData = {
    name: "constrData",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesConstCost(params.get(43)),
    memModel: (params) => new ArgSizesConstCost(params.get(44)),
    call: (args, ctx) => {
        const [tag, fields] = asUplcValues(args)

        if (!(tag instanceof UplcInt)) {
            throw new Error(
                `expected an integer as first argument of constrData, got ${tag?.toString()}`
            )
        }

        if (!(fields instanceof UplcList)) {
            throw new Error(
                `expected a list as second argument of constrData, got ${fields?.toString()}`
            )
        }

        if (!fields.isDataList()) {
            throw new Error("second argument of constrData is not a data list")
        }

        return asCekValue(
            new UplcDataValue(
                new ConstrData(
                    Number(tag.value),
                    fields.items.map((f) => {
                        if (f instanceof UplcDataValue) {
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
