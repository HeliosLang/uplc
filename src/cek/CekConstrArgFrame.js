/**
 * @import {
 *   CekConstrArgFrame,
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   CekTerm,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {number} tag
 * @param {CekValue[]} evaluatedArgs
 * @param {CekTerm[]} pendingArgs
 * @param {CekEnv} env
 * @returns {CekConstrArgFrame}
 */
export function makeCekConstrArgFrame(tag, evaluatedArgs, pendingArgs, env) {
    return new CekConstrArgFrameImpl(tag, evaluatedArgs, pendingArgs, env)
}

/**
 * @implements {CekConstrArgFrame}
 */
class CekConstrArgFrameImpl {
    /**
     * @readonly
     * @type {number}
     */
    tag

    /**
     * @readonly
     * @type {CekValue[]}
     */
    evaluatedArgs

    /**
     * @readonly
     * @type {CekTerm[]}
     */
    pendingArgs

    /**
     * @readonly
     * @type {CekEnv}
     */
    env

    /**
     * @param {number} tag
     * @param {CekValue[]} evaluatedArgs
     * @param {CekTerm[]} pendingArgs
     * @param {CekEnv} env
     */
    constructor(tag, evaluatedArgs, pendingArgs, env) {
        this.tag = tag
        this.evaluatedArgs = evaluatedArgs
        this.pendingArgs = pendingArgs
        this.env = env
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} value
     * @param {CekContext} _ctx
     * @returns {CekState}
     */
    reduce(frames, value, _ctx) {
        const evaluatedArgs = this.evaluatedArgs.concat([value])

        if (this.pendingArgs.length == 0) {
            return {
                kind: "reducing",
                value: {
                    kind: "constr",
                    tag: this.tag,
                    args: evaluatedArgs
                },
                frames
            }
        } else {
            return {
                kind: "computing",
                term: this.pendingArgs[0],
                env: this.env,
                frames: frames.concat([
                    makeCekConstrArgFrame(
                        this.tag,
                        evaluatedArgs,
                        this.pendingArgs.slice(1),
                        this.env
                    )
                ])
            }
        }
    }
}
