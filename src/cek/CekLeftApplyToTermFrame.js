import { mixStacks } from "./CekEnv.js"
import { makeCekRightApplyFrame } from "./CekRightApplyFrame.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekLeftApplyToTermFrame,
 *   CekEnv,
 *   CekState,
 *   CekTerm,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekTerm} term
 * @param {CekEnv} env
 * @param {Site | undefined} [callSite]
 * @returns {CekLeftApplyToTermFrame}
 */
export function makeCekLeftApplyToTermFrame(term, env, callSite = undefined) {
    return new CekLeftApplyToTermFrameImpl(term, env, callSite)
}

/**
 * @implements {CekLeftApplyToTermFrame}
 */
class CekLeftApplyToTermFrameImpl {
    /**
     * @readonly
     * @type {CekTerm}
     */
    arg

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
     * @param {CekTerm} arg
     * @param {CekEnv} env
     * @param {Site | undefined} callSite
     */
    constructor(arg, env, callSite) {
        this.arg = arg
        this.env = env
        this.callSite = callSite
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} value - fn value
     * @param {CekContext} _ctx
     * @returns {CekState}
     */
    reduce(frames, value, _ctx) {
        if (value.kind == "lambda") {
            return {
                kind: "computing",
                term: this.arg,
                env: this.env,
                frames: frames.concat([
                    makeCekRightApplyFrame(
                        value,
                        mixStacks(value.env, this.env),
                        {
                            callSite: this.callSite,
                            name: value.name,
                            argName: value.argName
                        }
                    )
                ])
            }
        } else {
            return {
                kind: "computing",
                term: this.arg,
                env: this.env,
                frames: frames.concat([
                    makeCekRightApplyFrame(value, this.env, {
                        callSite: this.callSite
                    })
                ])
            }
        }
    }
}
