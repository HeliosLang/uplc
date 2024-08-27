import { ArgSizesConstCost } from "../../costmodel/index.js"
import { ListData } from "../../data/index.js"
import { UplcDataValue, UplcList, UplcPair } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const listData = {
    name: "listData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(97)),
    memModel: (params) => new ArgSizesConstCost(params.get(98)),
    call: (args, ctx) => {
        const [list] = asUplcValues(args)

        if (!(list instanceof UplcList)) {
            throw new Error(
                `expected a list as first argument of listData, got ${list?.toString()}`
            )
        }

        if (!list.isDataList()) {
            throw new Error(
                `first argument of listData isn't a data list (i.e. not a list of data items)`
            )
        }

        return asCekValue(
            new UplcDataValue(
                new ListData(
                    list.items.map((item) => {
                        if (item instanceof UplcDataValue) {
                            return item.value
                        } else {
                            throw new Error("unexpected data list item")
                        }
                    })
                )
            )
        )
    }
}
