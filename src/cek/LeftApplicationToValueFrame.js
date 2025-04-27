import { expectDefined } from "@helios-lang/type-utils"
import { applyCekValues } from "./applyCekValues.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { CallSiteInfo, CekContext, CekFrame, CekStack, CekStateChange, CekValue } from "../index.js"
 */

/**
 * @param {CekValue} value
 * @param {CekStack} stack - not used directly, but provides useful information when debugging
 * @param {Site | undefined} callSite
 * @returns {CekFrame}
 */
export function makeLeftApplicationToValueFrame(
    value,
    stack,
    callSite = undefined
) {
    return new LeftApplicationToValueFrame(value, stack, callSite)
}

/**
 * @implements {CekFrame}
 */
class LeftApplicationToValueFrame {
    /**
     * Right value
     * @readonly
     * @type {CekValue}
     */
    value

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @readonly
     * @type {Site | undefined}
     */
    callSite

    /**
     * @param {CekValue} value
     * @param {CekStack} stack - not used directly, only for debugging
     * @param {Site | undefined} callSite
     */
    constructor(value, stack, callSite) {
        this.value = expectDefined(value)
        this.stack = stack
        this.callSite = callSite
    }

    /**
     * @param {CekValue} leftValue - left value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(leftValue, ctx) {
        return applyCekValues(leftValue, this.value, this.stack, ctx, {
            callSite: this.callSite
        })
    }
}
