import { None } from "@helios-lang/type-utils"
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
 * @returns {CekValue[]}
 */
export function findUnreportedNamedValues(stack) {
    /**
     * @type {Option<CekValue>}
     */
    let lastArg = None

    for (let i = stack.callSites.length - 1; i >= 0; i--) {
        const cs = stack.callSites[i]

        if (cs.argument) {
            lastArg = cs.argument
            break
        }
    }

    if (!lastArg) {
        console.log("no unreported named values found")
        return []
    }

    // find the arg in the stack values
    for (let i = stack.values.length - 1; i >= 0; i--) {
        const v = stack.values[i]

        if (v == lastArg) {
            return stack.values.slice(i + 1)
        }
    }

    return []
}
