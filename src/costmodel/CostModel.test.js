import { describe, it } from "node:test"
import { builtinsV1, builtinsV2, builtinsV3 } from "../builtins/index.js"
import { CostModel } from "./CostModel.js"
import { CostModelParamsProxy } from "./CostModelParamsProxy.js"
import { BABBAGE_COST_MODEL_PARAMS_V1 } from "./CostModelParamsV1.js"
import { BABBAGE_COST_MODEL_PARAMS_V2 } from "./CostModelParamsV2.js"
import { CONWAY_COST_MODEL_PARAMS_V3 } from "./CostModelParamsV3.js"
import { None } from "@helios-lang/type-utils"

describe(`${CostModel.name} for V1`, () => {
    it("all params used exactly once", () => {
        const params = new CostModelParamsProxy(BABBAGE_COST_MODEL_PARAMS_V1)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        new CostModel(
            {
                /**
                 * @param {number} key
                 * @returns {bigint}
                 */
                get: (key, def = None) => {
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

describe(`${CostModel.name} for V2`, () => {
    it("all params used exactly once", () => {
        const params = new CostModelParamsProxy(BABBAGE_COST_MODEL_PARAMS_V2)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        new CostModel(
            {
                /**
                 * @param {number} key
                 * @param {Option<bigint>} def
                 * @returns {bigint}
                 */
                get: (key, def = None) => {
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

describe(`${CostModel.name} for V3`, () => {
    it("all params used exactly once", () => {
        const params = new CostModelParamsProxy(CONWAY_COST_MODEL_PARAMS_V3)

        /**
         * @type {Set<number>}
         */
        const used = new Set()

        new CostModel(
            {
                /**
                 * @param {number} key
                 * @returns {bigint}
                 */
                get: (key, def = None) => {
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
