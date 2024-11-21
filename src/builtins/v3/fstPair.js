import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { fstPair as fstPairV1 } from "../v1/fstPair.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const fstPair = {
    ...fstPairV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(78)),
    memModel: (params) => makeArgSizesConstCost(params.get(79))
}
