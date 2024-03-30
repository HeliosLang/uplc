import { CostModelParamsProxy } from "./CostModelParamsProxy.js"

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./Cost.js").Cost} Cost
 */

/**
 * @typedef {{
 *   calcCost: (argSizes: bigint[]) => bigint
 * }} ArgSizesCost
 */

/**
 * @typedef {{
 *   new(params: CostModelParamsProxy, key: string): ArgSizesCost
 * }} ArgSizesCostClass
 */
