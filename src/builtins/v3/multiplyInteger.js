import { ArgSizesSumCost } from "../../costmodel/index.js"
import { multiplyInteger as multiplyIntegerV1 } from "../v1/multiplyInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const multiplyInteger = {
    ...multiplyIntegerV1,
    cpuModel: (params) => new ArgSizesSumCost(params.get(125), params.get(124)),
    memModel: (params) => new ArgSizesSumCost(params.get(127), params.get(126))
}
