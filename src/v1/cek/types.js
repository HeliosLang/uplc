/**
 * Types with circular dependencies:
 *   * CekFrame, CekState, CekStateChange, CekTerm, CekValue
 */

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
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
