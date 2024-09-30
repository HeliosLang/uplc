import { CostTracker } from "../costmodel/index.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../builtins/index.js").BuiltinContext} BuiltinContext
 */

/**
 * @typedef {BuiltinContext & {
 *   cost: CostTracker
 *   getBuiltin: (id: number) => (undefined | Builtin)
 *   popLastMessage: () => string | undefined
 *   print: (message: string, site?: Option<Site>) => void
 * }} CekContext
 */
