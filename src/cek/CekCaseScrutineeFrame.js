import { makeCekLeftApplyToValueFrame } from "./CekLeftApplyToValueFrame.js"

/**
 * @import {
 *   CekCaseScrutineeFrame,
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   CekTerm,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekTerm[]} cases
 * @param {CekEnv} env
 * @returns {CekCaseScrutineeFrame}
 */
export function makeCekCaseScrutineeFrame(cases, env) {
    return new CekCaseScrutineeFrameImpl(cases, env)
}

/**
 * @implements {CekCaseScrutineeFrame}
 */
class CekCaseScrutineeFrameImpl {
    /**
     * @readonly
     * @type {CekTerm[]}
     */
    cases

    /**
     * @readonly
     * @type {CekEnv}
     */
    env

    /**
     * @param {CekTerm[]} cases
     * @param {CekEnv} env
     */
    constructor(cases, env) {
        this.cases = cases
        this.env = env
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} value
     * @param {CekContext} _ctx
     * @returns {CekState}
     */
    reduce(frames, value, _ctx) {
        if (value.kind == "constr") {
            const tag = value.tag

            const c = this.cases[tag]

            if (!c) {
                return {
                    kind: "error",
                    message: "constr id out of range",
                    env: this.env
                }
            }

            const callFrames = value.args.map((a) =>
                makeCekLeftApplyToValueFrame(a, this.env, undefined)
            )

            callFrames.reverse()

            return {
                kind: "computing",
                term: c,
                env: this.env,
                // TODO: callSite
                frames: frames.concat(callFrames)
            }
        } else {
            return {
                kind: "error",
                message: "expected constr value case",
                env: this.env
            }
        }
    }
}
