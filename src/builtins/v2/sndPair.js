import { ArgSizesConstCost } from "../../costmodel/index.js"
import { sndPair as sndPairV1 } from "../v1/sndPair.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const sndPair = {
    ...sndPairV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(147)),
    memModel: (params) => new ArgSizesConstCost(params.get(148))
}
