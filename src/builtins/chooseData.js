import { ArgSizesConstCost } from "../costmodel/index.js"
import {
    ByteArrayData,
    ConstrData,
    IntData,
    ListData,
    MapData
} from "../data/index.js"
import { UplcDataValue } from "../values/index.js"
import { asUplcValue } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
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

        if (!(data instanceof UplcDataValue)) {
            throw new Error(
                `expected data value as first argument of chooseData, got ${data?.toString()}`
            )
        }

        if (data.value instanceof ConstrData) {
            return args[1]
        } else if (data.value instanceof MapData) {
            return args[2]
        } else if (data.value instanceof ListData) {
            return args[3]
        } else if (data.value instanceof IntData) {
            return args[4]
        } else if (data.value instanceof ByteArrayData) {
            return args[5]
        } else {
            throw new Error("unexpected data type in chooseData")
        }
    }
}
