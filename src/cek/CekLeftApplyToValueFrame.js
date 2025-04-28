import { applyCekValues } from "./applyCekValues.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CallSiteInfo,
 *   CekContext,
 *   CekFrame,
 *   CekLeftApplyToValueFrame,
 *   CekEnv,
 *   CekState,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekValue} rhs
 * @param {CekEnv} env - not used directly, but provides useful information when debugging
 * @param {Site | undefined} callSite
 * @returns {CekLeftApplyToValueFrame}
 */
export function makeCekLeftApplyToValueFrame(rhs, env, callSite = undefined) {
    return new CekLeftApplyToValueFrameImpl(rhs, env, callSite)
}

/**
 * @implements {CekLeftApplyToValueFrame}
 */
class CekLeftApplyToValueFrameImpl {
    /**
     * Right value
     * @readonly
     * @type {CekValue}
     */
    rhs

    /**
     * @readonly
     * @type {CekEnv}
     */
    env

    /**
     * @readonly
     * @type {Site | undefined}
     */
    callSite

    /**
     * @param {CekValue} rhs
     * @param {CekEnv} env - not used directly, only for debugging
     * @param {Site | undefined} callSite
     */
    constructor(rhs, env, callSite) {
        this.rhs = rhs
        this.env = env
        this.callSite = callSite
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} lhs
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    reduce(frames, lhs, ctx) {
        return applyCekValues(frames, lhs, this.rhs, this.env, ctx, {
            callSite: this.callSite
        })
    }
}
