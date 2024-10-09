export {}

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./Cost.js").Cost} Cost
 * @typedef {import("./CostModelParamsProxy.js").CostModelParamsProxyI} CostModelParamsProxyI
 */

/**
 * @typedef {{
 *   calcCost: (argSizes: bigint[]) => bigint
 * }} ArgSizesCost
 */

/**
 * @typedef {(params: CostModelParamsProxyI) => ArgSizesCost} ArgSizesCostClass
 */
