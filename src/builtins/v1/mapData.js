import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeMapData } from "../../data/index.js"
import { makeUplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */
/**
 * @type {Builtin}
 */
export const mapData = {
    name: "mapData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(99)),
    memModel: (params) => makeArgSizesConstCost(params.get(100)),
    call: (args, _ctx) => {
        const [list] = asUplcValues(args)

        if (list?.kind != "list") {
            throw new Error(
                `expected a list as first argument of mapData, got ${list?.toString()}`
            )
        }

        if (!list.isDataMap()) {
            throw new Error(
                `first argument of mapData isn't a data map (i.e. not a list of data pairs)`
            )
        }

        return asCekValue(
            makeUplcDataValue(
                makeMapData(
                    list.items.map((item) => {
                        if (item.kind == "pair") {
                            const a = item.first
                            const b = item.second

                            if (a.kind != "data") {
                                throw new Error(
                                    "unexpected non-data first entry in pair"
                                )
                            }

                            if (b.kind != "data") {
                                throw new Error(
                                    "unexpected non-data second entry in pair"
                                )
                            }

                            return [a.value, b.value]
                        } else {
                            throw new Error("unexpected data map item")
                        }
                    })
                )
            )
        )
    }
}
