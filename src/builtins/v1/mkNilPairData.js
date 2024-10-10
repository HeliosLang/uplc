import { ArgSizesConstCost } from "../../costmodel/index.js"
import { UplcList, UplcType } from "../../values/index.js"
import { asCekValue, asUplcValue } from "../cast.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkNilPairData = {
    name: "mkNilPairData",
    forceCount: 0,
    nArgs: 1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(105)),
    memModel: (params) => new ArgSizesConstCost(params.get(106)),
    call: (args, _ctx) => {
        const a = asUplcValue(args[0])

        if (a?.kind != "unit") {
            throw new Error(
                `expected a unit value for the first argument of mkNilPairData, got ${a?.toString()}`
            )
        }

        return asCekValue(new UplcList(UplcType.dataPair(), []))
    }
}
