import { ArgSizesSumCost } from "../../costmodel/index.js"
import { UplcByteArray } from "../../values/index.js"
import { asCekValue, asUplcValues } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const appendByteString = {
    name: "appendByteString",
    forceCount: 0,
    nArgs: 2,
    cpuModel: (params) => new ArgSizesSumCost(params.get(5), params.get(4)),
    memModel: (params) => new ArgSizesSumCost(params.get(7), params.get(6)),
    call: (args, ctx) => {
        const [a, b] = asUplcValues(args)

        if (!(a instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the first argument of appendByteString, got ${a?.toString()}`
            )
        }

        if (!(b instanceof UplcByteArray)) {
            throw new Error(
                `expected a byte array for the second argument of appendByteString, got ${b?.toString()}`
            )
        }

        return asCekValue(new UplcByteArray(a.bytes.concat(b.bytes)))
    }
}
