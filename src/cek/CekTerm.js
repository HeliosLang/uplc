export {}

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekStack.js").CekStack} CekStack - circular import, but is allowed in JSDocs
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange - circular import, but is allowed in JSDocs
 */

/**
 * @typedef {{
 *   compute: (stack: CekStack, ctx: CekContext) => CekStateChange
 *   site: Option<Site>
 *   toString: () => string
 * }} CekTerm
 */
