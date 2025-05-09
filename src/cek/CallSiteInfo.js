/**
 * @import { CallSiteInfo } from "../index.js"
 */

/**
 * @param {CallSiteInfo | undefined} info
 * @returns {boolean}
 */
export function isEmptyCallSiteInfo(info) {
    return !info || (!info.site && !info.functionName && !info.arguments)
}

/**
 * @param {CallSiteInfo | undefined} info
 * @returns {info is CallSiteInfo}
 */
export function isNonEmptyCallSiteInfo(info) {
    return !isEmptyCallSiteInfo(info)
}
