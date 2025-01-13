import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { lengthOfByteString as lengthOfByteStringV1 } from "../v1/lengthOfByteString.js"

/**
 * @import { Builtin } from "../../index.js"
 */
/**
 * @type {Builtin}
 */
export const lengthOfByteString = /* @__PURE__ */ (() => ({
    ...lengthOfByteStringV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(88)),
    memModel: (params) => makeArgSizesConstCost(params.get(89))
}))()
