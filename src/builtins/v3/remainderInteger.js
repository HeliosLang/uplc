import {
    ArgSizesQuadXYCost,
    ArgSizesSecondCost
} from "../../costmodel/index.js"
import { remainderInteger as remainderIntegerV1 } from "../v1/remainderInteger.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const remainderInteger = {
    ...remainderIntegerV1,
    cpuModel: (params) =>
        new ArgSizesQuadXYCost(params.get(141), params.get(148), {
            c00: params.get(142),
            c01: params.get(143),
            c02: params.get(144),
            c10: params.get(145),
            c11: params.get(146),
            c20: params.get(147)
        }),
    memModel: (params) =>
        new ArgSizesSecondCost(params.get(150), params.get(149))
}
