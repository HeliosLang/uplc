export {}

/**
 * @typedef {import("../cek/CekValue.js").CekValue} CekValue
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
