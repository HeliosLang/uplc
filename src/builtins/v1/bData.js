import { ArgSizesConstCost } from "../../costmodel/index.js"
import { makeByteArrayData } from "../../data/index.js"
import { makeUplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const bData = {
    name: "bData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(12)),
    memModel: (params) => new ArgSizesConstCost(params.get(13)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array as the first argument of bData, got ${a?.toString()}`
            )
        }

        return asCekValue(
            makeUplcDataValue(makeByteArrayData({ bytes: a.bytes }))
        )
    }
}
