import { ArgSizesConstCost } from "../../costmodel/index.js"
import { lengthOfByteString as lengthOfByteStringV1 } from "../v1/lengthOfByteString.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const lengthOfByteString = {
    ...lengthOfByteStringV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(88)),
    memModel: (params) => new ArgSizesConstCost(params.get(89))
}
