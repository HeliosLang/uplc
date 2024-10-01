export {}

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CekStack.js").CekStack} CekStack - circular import, but is allowed in JSDocs
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm - circular import, but is allowed in JSDocs
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
