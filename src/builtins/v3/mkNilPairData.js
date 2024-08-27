import { ArgSizesConstCost } from "../../costmodel/index.js"
import { mkNilPairData as mkNilPairDataV1 } from "../v1/mkNilPairData.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const mkNilPairData = {
    ...mkNilPairDataV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(110)),
    memModel: (params) => new ArgSizesConstCost(params.get(111))
}
