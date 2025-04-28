import { isNonEmptyCallSiteInfo } from "./CallSiteInfo.js"

/**
 * @import { CallSiteInfo, CekEnv, CekValue } from "../index.js"
 */

/**
 * @param {CekEnv} env
 * @param {CallSiteInfo | undefined} callSite
 * @returns {CekEnv}
 */
export function pushStackCallSite(env, callSite) {
    if (isNonEmptyCallSiteInfo(callSite)) {
        return {
            values: env.values,
            callSites: env.callSites.concat([callSite])
        }
    } else {
        return env
    }
}

/**
 * @param {CekEnv} env
 * @param {CallSiteInfo[]} callSites
 * @returns {CekEnv}
 */
export function pushStackCallSites(env, ...callSites) {
    return {
        values: env.values,
        callSites: env.callSites.concat(
            callSites.filter(isNonEmptyCallSiteInfo)
        )
    }
}

/**
 * @param {CekEnv} env
 * @param {CekValue} value
 * @returns {CekEnv}
 */
export function pushStackValue(env, value) {
    return {
        values: env.values.concat([value]),
        callSites: env.callSites
    }
}

/**
 * @param {CekEnv} env
 * @param {CekValue} value
 * @param {CallSiteInfo | undefined} callSite
 * @returns {CekEnv}
 */
export function pushStackValueAndCallSite(env, value, callSite) {
    return {
        values: env.values.concat([value]),
        callSites: env.callSites.concat(
            isNonEmptyCallSiteInfo(callSite) ? [callSite] : []
        )
    }
}

/**
 * @param {CekEnv} env
 * @param {CekValue} value
 * @param {CallSiteInfo[]} callSites
 * @returns {CekEnv}
 */
export function pushStackValueAndCallSites(env, value, ...callSites) {
    return {
        values: env.values.concat([value]),
        callSites: env.callSites.concat(callSites)
    }
}

/**
 * @param {CekEnv} stackWithValues
 * @param {CekEnv} stackWithCallSites
 * @returns {CekEnv}
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
 * @param {CekEnv} env
 * @returns {CekValue | undefined}
 */
export function getLastSelfValue(env) {
    const last = env.values[env.values.length - 1]

    if (last?.name == "self") {
        return last
    } else {
        return undefined
    }
}
