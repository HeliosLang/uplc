import { ArgSizesConstCost } from "../../costmodel/index.js"
import {
    ByteArrayData,
    ConstrData,
    IntData,
    ListData,
    MapData
} from "../../data/index.js"
import { UplcDataValue } from "../../values/index.js"
import { asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const chooseData = {
    name: "chooseData",
    forceCount: 1,
    nArgs: 6,
    cpuModel: (params) => new ArgSizesConstCost(params.get(33)),
    memModel: (params) => new ArgSizesConstCost(params.get(34)),
    call: (args, ctx) => {
        const data = asUplcValue(args[0])

        if (data?.kind != "data") {
            throw new Error(
                `expected data value as first argument of chooseData, got ${data?.toString()}`
            )
        }

        switch (data.value.kind) {
            case "constr":
                return args[1]
            case "map":
                return args[2]
            case "list":
                return args[3]
            case "int":
                return args[4]
            case "bytes":
                return args[5]
            default:
                throw new Error("unexpected data type in chooseData")
        }
    }
}
