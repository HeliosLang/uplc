import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { lengthOfByteString as lengthOfByteStringV1 } from "../v1/lengthOfByteString.js"

/**
 * @import { Builtin } from "src/index.js"
 */
/**
 * @type {Builtin}
 */
export const lengthOfByteString = {
    ...lengthOfByteStringV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(88)),
    memModel: (params) => makeArgSizesConstCost(params.get(89))
}
