import { applyCekValues } from "./applyCekValues.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekApplyInfo,
 *   CekContext,
 *   CekFrame,
 *   CekRightApplyFrame,
 *   CekState,
 *   CekEnv,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekValue} fn
 * @param {CekEnv} env
 * @param {CekApplyInfo} [info]
 * @returns {CekRightApplyFrame}
 */
export function makeCekRightApplyFrame(fn, env, info = {}) {
    return new CekRightApplyFrameImpl(fn, env, info)
}

/**
 * @implements {CekRightApplyFrame}
 */
class CekRightApplyFrameImpl {
    /**
     * @readonly
     * @type {CekValue}
     */
    fn

    /**
     * @readonly
     * @type {CekEnv}
     */
    env

    /**
     * @readonly
     * @type {CekApplyInfo}
     */
    info

    /**
     * @param {CekValue} fn
     * @param {CekEnv} env
     * @param {CekApplyInfo} info
     */
    constructor(fn, env, info) {
        this.fn = fn
        this.env = env
        this.info = info
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    reduce(frames, value, ctx) {
        return applyCekValues(frames, this.fn, value, this.env, ctx, this.info)
    }
}
