import { ArgSizesConstCost } from "../../costmodel/index.js"
import { MapData } from "../../data/index.js"
import { UplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mapData = {
    name: "mapData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(99)),
    memModel: (params) => new ArgSizesConstCost(params.get(100)),
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
            new UplcDataValue(
                new MapData(
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
