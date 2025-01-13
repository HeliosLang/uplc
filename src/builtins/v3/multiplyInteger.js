import { makeArgSizesSumCost } from "../../costmodel/index.js"
import { multiplyInteger as multiplyIntegerV1 } from "../v1/multiplyInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const multiplyInteger = /* @__PURE__ */ (() => ({
    ...multiplyIntegerV1,
    cpuModel: (params) => makeArgSizesSumCost(params.get(125), params.get(124)),
    memModel: (params) => makeArgSizesSumCost(params.get(127), params.get(126))
}))()
