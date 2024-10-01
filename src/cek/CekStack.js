/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekValue.js").CekValue} CekValue - circular import, but is allowed in JSDocs
 */

/**
 * @typedef {{
 *   values: CekValue[]
 *   callSites: Site[]
 * }} CekStack
 */

/**
 * @param {CekStack} stack
 * @param {Option<Site>} callSite
 * @returns {CekStack}
 */
export function pushStackCallSite(stack, callSite) {
    if (callSite) {
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
 * @param {Option<Site>} callSite
 * @returns {CekStack}
 */
export function pushStackValueAndCallSite(stack, value, callSite) {
    return {
        values: stack.values.concat([value]),
        callSites: stack.callSites.concat(callSite ? [callSite] : [])
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
