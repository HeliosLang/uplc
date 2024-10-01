export {}

/**
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange - circular import, but is allowed in JSDocs
 * @typedef {import("./CekValue.js").CekValue} CekValue - circular import, but is allowed in JSDocs
 */

/**
 * @typedef {{
 *   reduce: (value: CekValue, ctx: CekContext) => CekStateChange
 * }} CekFrame
 */
