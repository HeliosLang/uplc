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

/**
 * @param {Option<CallSiteInfo>} info
 * @returns {boolean}
 */
export function isEmptyCallSiteInfo(info) {
    return !info || (!info.site && !info.functionName && !info.argument)
}

/**
 * @param {Option<CallSiteInfo>} info
 * @returns {info is CallSiteInfo}
 */
export function isNonEmptyCallSiteInfo(info) {
    return !isEmptyCallSiteInfo(info)
}
