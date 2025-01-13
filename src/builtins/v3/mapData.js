import { makeArgSizesConstCost } from "../../costmodel/index.js"
import { mapData as mapDataV1 } from "../v1/mapData.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin}
 */
export const mapData = /* @__PURE__ */ (() => ({
    ...mapDataV1,
    cpuModel: (params) => makeArgSizesConstCost(params.get(104)),
    memModel: (params) => makeArgSizesConstCost(params.get(105))
}))()
