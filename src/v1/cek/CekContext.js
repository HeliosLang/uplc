import { CostTracker } from "../costmodel/index.js"

/**
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 */

/**
 * @typedef {import("../builtins/index.js").BuiltinContext} BuiltinContext
 */

/**
 * @typedef {BuiltinContext & {
 *   cost: CostTracker
 *   getBuiltin: (id: number) => (undefined | Builtin)
 * }} CekContext
 */
