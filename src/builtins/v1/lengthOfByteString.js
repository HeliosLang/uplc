import { ArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lengthOfByteString = {
    name: "lengthOfByteString",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(83)),
    memModel: (params) => new ArgSizesConstCost(params.get(84)),
    call: (args, _ctx) => {
        const [a] = asUplcValues(args)

        if (a?.kind != "bytes") {
            throw new Error(
                `expected a byte array for the first argument of lengthOfByteString, got ${a?.toString()}`
            )
        }

        return asCekValue(makeUplcInt(a.bytes.length))
    }
}
