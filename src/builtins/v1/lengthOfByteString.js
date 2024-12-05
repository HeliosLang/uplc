import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const lengthOfByteString = {
    name: "lengthOfByteString",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(83)),
    memModel: (params) => makeArgSizesConstCost(params.get(84)),
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
