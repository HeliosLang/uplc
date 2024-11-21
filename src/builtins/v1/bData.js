import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeByteArrayData } from "../../data/index.js"
import { makeUplcDataValue } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 * @__PURE__
 */
export const bData = {
    name: "bData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(12)),
    memModel: (params) => makeArgSizesConstCost(params.get(13)),
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
