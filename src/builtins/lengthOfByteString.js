import { ArgSizesConstCost } from "../costmodel/index.js"
import { UplcByteArray, UplcInt } from "../values/index.js"
import { asCekValue, asUplcValues } from "./cast.js"

/**
 * @typedef {import("./Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lengthOfByteString = {
    name: "lengthOfByteString",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(88)),
    memModel: (params) => new ArgSizesConstCost(params.get(89)),
    call: (args, ctx) => {
        const [a] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of lengthOfByteString, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcInt(a.bytes.length))
    }
}
