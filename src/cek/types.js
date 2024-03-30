/**
 * Types with circular dependencies:
 *   * CekFrame, CekState, CekStateChange, CekTerm, CekValue
 */

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CekContext.js").CekContext} CekContext
 */

/**
 * @typedef {{
 *   reduce: (value: CekValue, ctx: CekContext) => CekStateChange
 * }} CekFrame
 */

/**
 * @typedef {{
 *   computing: {
 *     term: CekTerm
 *     stack: CekValue[]
 *   }
 * } | {
 *   reducing: CekValue
 * } | {
 *   error: {
 *     message: string
 *   }
 * }} CekState
 */

/**
 * @typedef {{
 *   state: CekState
 *   frame?: CekFrame
 * }} CekStateChange
 */

/**
 * @typedef {{
 *   compute: (stack: CekValue[], ctx: CekContext) => CekStateChange
 *   site: Option<Site>
 *   toString: () => string
 * }} CekTerm
 */

/**
 * Generalized UplcValue
 * @typedef {{
 *   value: UplcValue
 * } | {
 *   delay: {
 *     term: CekTerm
 *     stack: CekValue[]
 *   }
 * } | {
 *   lambda: {
 *     term: CekTerm
 *     argName?: string
 *     stack: CekValue[]
 *   }
 * } | {
 *   builtin: {
 *     id: number
 *     forceCount: number
 *     args: CekValue[]
 *   }
 * }} CekValue
 */
