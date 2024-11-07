import { describe, it } from "node:test"
import { builtinsV1, builtinsV2, builtinsV3 } from "../builtins/index.js"
import { makeCostModel } from "./CostModel.js"
import { makeCostModelParamsProxy } from "./CostModelParamsProxy.js"
import { BABBAGE_COST_MODEL_PARAMS_V1 } from "./CostModelParamsV1.js"
import { BABBAGE_COST_MODEL_PARAMS_V2 } from "./CostModelParamsV2.js"
import { CONWAY_COST_MODEL_PARAMS_V3 } from "./CostModelParamsV3.js"

describe(`CostModel for V1`, () => {
    it("all params used exactly once", () => {
        const params = makeCostModelParamsProxy(BABBAGE_COST_MODEL_PARAMS_V1)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        makeCostModel(
            {
                /**
                 * @param {number} key
                 * @param {bigint | undefined} def
                 * @returns {bigint}
                 */
                get: (key, def = undefined) => {
                    if (used.has(key)) {
                        throw new Error(`CostModelParams[${key}] already used`)
                    }

                    used.add(key)

                    return params.get(key, def)
                }
            },
            builtinsV1
        )

        BABBAGE_COST_MODEL_PARAMS_V1.forEach((_v, i) => {
            if (!used.has(i)) {
                throw new Error(`CostModelParams[${i}] unused`)
            }
        })
    })
})

describe(`CostModel for V2`, () => {
    it("all params used exactly once", () => {
        const params = makeCostModelParamsProxy(BABBAGE_COST_MODEL_PARAMS_V2)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        makeCostModel(
            {
                /**
                 * @param {number} key
                 * @param {bigint | undefined} def
                 * @returns {bigint}
                 */
                get: (key, def = undefined) => {
                    if (used.has(key)) {
                        throw new Error(`CostModelParams[${key}] already used`)
                    }

                    used.add(key)

                    return params.get(key, def)
                }
            },
            builtinsV2
        )

        BABBAGE_COST_MODEL_PARAMS_V2.forEach((_v, i) => {
            if (!used.has(i)) {
                throw new Error(`CostModelParams[${i}] unused`)
            }
        })
    })
})

describe(`CostModel for V3`, () => {
    it("all params used exactly once", () => {
        const params = makeCostModelParamsProxy(CONWAY_COST_MODEL_PARAMS_V3)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        makeCostModel(
            {
                /**
                 * @param {number} key
                 * @param {bigint | undefined} def
                 * @returns {bigint}
                 */
                get: (key, def = undefined) => {
                    if (used.has(key)) {
                        throw new Error(`CostModelParams[${key}] already used`)
                    }

                    used.add(key)

                    return params.get(key, def)
                }
            },
            builtinsV3
        )

        CONWAY_COST_MODEL_PARAMS_V3.forEach((_v, i) => {
            if (!used.has(i)) {
                throw new Error(`CostModelParams[${i}] unused`)
            }
        })
    })
})
