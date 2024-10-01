export {}

/**
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame - circular import, but is allowed in JSDocs
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm - circular import, but is allowed in JSDocs
 * @typedef {import("./CekStack.js").CekStack} CekStack - circular import, but is allowed in JSDocs
 * @typedef {import("./CekValue.js").CekValue} CekValue - circular import, but is allowed in JSDocs
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
 *     stack: CekStack
 *   }
 * }} CekState
 */

/**
 * @typedef {{
 *   state: CekState
 *   frame?: CekFrame
 * }} CekStateChange
 */
