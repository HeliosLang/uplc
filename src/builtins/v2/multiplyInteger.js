import {
    makeArgSizesProdCost,
    makeArgSizesSumCost
} from "../../costmodel/index.js"
import { multiplyInteger as multiplyIntegerV1 } from "../v1/multiplyInteger.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const multiplyInteger = /* @__PURE__ */ (() => ({
    ...multiplyIntegerV1,
    cpuModel: (params) =>
        makeArgSizesProdCost(params.get(116), params.get(115)),
    memModel: (params) => makeArgSizesSumCost(params.get(118), params.get(117))
}))()
