import {
    ArgSizesSecondCost,
    ArgSizesQuadXYCost
} from "../../costmodel/index.js"
import { modInteger as modIntegerV1 } from "../v1/modInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const modInteger = {
    ...modIntegerV1,
    cpuModel: (params) =>
        new ArgSizesQuadXYCost(params.get(114), params.get(121), {
            c00: params.get(115),
            c01: params.get(116),
            c02: params.get(117),
            c10: params.get(118),
            c11: params.get(119),
            c20: params.get(120)
        }),
    memModel: (params) =>
        new ArgSizesSecondCost(params.get(123), params.get(122))
}
