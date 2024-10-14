export {}

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./Cost.js").Cost} Cost
 * @typedef {import("./CostModelParamsProxy.js").CostModelParamsProxy} CostModelParamsProxy
 */

/**
 * @typedef {{
 *   calcCost: (argSizes: bigint[]) => bigint
 * }} ArgSizesCost
 */

/**
 * @typedef {(params: CostModelParamsProxy) => ArgSizesCost} ArgSizesCostClass
 */
