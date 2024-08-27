import { ArgSizesConstCost } from "../../costmodel/index.js"
import { fstPair as fstPairV1 } from "../v1/fstPair.js"

/**
 * @typedef {import("../Builtin.js").Builtin} Builtin
 */

/**
 * @type {Builtin}
 */
export const fstPair = {
    ...fstPairV1,
    cpuModel: (params) => new ArgSizesConstCost(params.get(78)),
    memModel: (params) => new ArgSizesConstCost(params.get(79))
}
