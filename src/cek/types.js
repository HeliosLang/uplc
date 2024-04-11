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
 *   values: CekValue[]
 * }} CekStack
 */

/**
 * @typedef {{
 *   computing: {
 *     term: CekTerm
 *     stack: CekStack
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
 *   compute: (stack: CekStack, ctx: CekContext) => CekStateChange
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
 *     stack: CekStack
 *   }
 * } | {
 *   lambda: {
 *     term: CekTerm
 *     argName?: string
 *     stack: CekStack
 *   }
 * } | {
 *   builtin: {
 *     id: number
 *     forceCount: number
 *     args: CekValue[]
 *   }
 * }} CekValue
 */
