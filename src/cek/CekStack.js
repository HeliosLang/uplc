import { isNonEmptyCallSiteInfo } from "./CallSiteInfo.js"

/**
 * @typedef {import("./CallSiteInfo.js").CallSiteInfo} CallSiteInfo
 * @typedef {import("./CekValue.js").CekValue} CekValue - circular import, but is allowed in JSDocs
 */

/**
 * @typedef {{
 *   values: CekValue[]
 *   callSites: CallSiteInfo[]
 * }} CekStack
 */

/**
 * @param {CekStack} stack
 * @param {Option<CallSiteInfo>} callSite
 * @returns {CekStack}
 */
export function pushStackCallSite(stack, callSite) {
    if (isNonEmptyCallSiteInfo(callSite)) {
        return {
            values: stack.values,
            callSites: stack.callSites.concat([callSite])
        }
    } else {
        return stack
    }
}

/**
 * @param {CekStack} stack
 * @param {CallSiteInfo[]} callSites
 * @returns {CekStack}
 */
export function pushStackCallSites(stack, ...callSites) {
    return {
        values: stack.values,
        callSites: stack.callSites.concat(
            callSites.filter(isNonEmptyCallSiteInfo)
        )
    }
}

/**
 * @param {CekStack} stack
 * @param {CekValue} value
 * @returns {CekStack}
 */
export function pushStackValue(stack, value) {
    return {
        values: stack.values.concat([value]),
        callSites: stack.callSites
    }
}

/**
 * @param {CekStack} stack
 * @param {CekValue} value
 * @param {Option<CallSiteInfo>} callSite
 * @returns {CekStack}
 */
export function pushStackValueAndCallSite(stack, value, callSite) {
    return {
        values: stack.values.concat([value]),
        callSites: stack.callSites.concat(
            isNonEmptyCallSiteInfo(callSite) ? [callSite] : []
        )
    }
}

/**
 * @param {CekStack} stackWithValues
 * @param {CekStack} stackWithCallSites
 * @returns {CekStack}
 */
export function mixStacks(stackWithValues, stackWithCallSites) {
    return {
        values: stackWithValues.values,
        callSites: stackWithCallSites.callSites
    }
}
