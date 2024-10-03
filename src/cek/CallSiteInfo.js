export {}

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

/**
 * So we can later add things like env function name, function values
 * @typedef {{
 *   site?: Option<Site>
 *   functionName?: string
 *   argument?: CekValue
 * }} CallSiteInfo
 */
