import { isNonEmptyCallSiteInfo } from "./CallSiteInfo.js"

/**
 * @import { CallSiteInfo, CekStack, CekValue } from "src/index.js"
 */

/**
 * @param {CekStack} stack
 * @param {CallSiteInfo | undefined} callSite
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
 * @param {CallSiteInfo | undefined} callSite
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
 * @param {CekStack} stack
 * @param {CekValue} value
 * @param {CallSiteInfo[]} callSites
 * @returns {CekStack}
 */
export function pushStackValueAndCallSites(stack, value, ...callSites) {
    return {
        values: stack.values.concat([value]),
        callSites: stack.callSites.concat(callSites)
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

/**
 * Only needed for debugging
 * Needed to add stack trace frames for variables like `self`
 * TODO: might introduce unnecessary overhead and thus require a flag to switch off
 * @param {CekStack} stack
 * @returns {CekValue | undefined}
 */
export function getLastSelfValue(stack) {
    const last = stack.values[stack.values.length - 1]

    if (last?.name == "self") {
        return last
    } else {
        return undefined
    }
}
