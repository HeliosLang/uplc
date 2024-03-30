/**
 * @typedef {import("../cek/types.js").CekValue} CekValue
 * @typedef {import("../costmodel/ArgSizesCost.js").ArgSizesCostClass} ArgSizesCostClass
 * @typedef {import("../costmodel/CostModel.js").BuiltinCostModel} BuiltinCostModel
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./BuiltinContext.js").BuiltinContext} BuiltinContext
 */

/**
 * @typedef {(args: CekValue[], ctx: BuiltinContext) => CekValue} BuiltinCallback
 */

/**
 * @typedef {BuiltinCostModel & {
 *   forceCount: number
 *   nArgs: number
 *   call: BuiltinCallback
 * }} Builtin
 */
