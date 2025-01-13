import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { sndPair as sndPairV1 } from "../v1/sndPair.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const sndPair = /* @__PURE__ */ (() => ({
    ...sndPairV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(147)),
    memModel: (params) => makeArgSizesConstCost(params.get(148))
}))()
