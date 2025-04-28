import { getLastSelfValue, mixStacks, pushStackCallSite } from "./CekEnv.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   CekContext,
 *   CekFrame,
 *   CekForceFrame,
 *   CekEnv,
 *   CekState,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekEnv} env
 * @param {Site | undefined} callSite
 * @returns {CekForceFrame}
 */
export function makeCekForceFrame(env, callSite) {
    return new ForceFrameImpl(env, callSite)
}

/**
 * @implements {CekForceFrame}
 */
class ForceFrameImpl {
    /**
     * Used for the parent callsites
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
     * @param {CekEnv} env
     * @param {Site | undefined} callSite
     */
    constructor(env, callSite) {
        this.env = env
        this.callSite = callSite
    }

    /**
     * @param {CekFrame[]} frames
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekState}
     */
    reduce(frames, value, ctx) {
        if (value.kind == "delay") {
            /**
             * TODO: cleaner way of getting `self` and other variables that are in the stacks of callbacks
             * @type {CekValue | undefined}
             */
            const lastSelfValue = getLastSelfValue(value.env)

            return {
                kind: "computing",
                term: value.term,
                env: mixStacks(
                    value.env,
                    pushStackCallSite(this.env, {
                        site: this.callSite ?? undefined,
                        functionName: value.name,
                        arguments: lastSelfValue ? [lastSelfValue] : undefined
                    })
                ),
                frames
            }
        } else if (value.kind == "builtin") {
            const b = ctx.getBuiltin(value.id)

            if (!b) {
                return {
                    kind: "error",
                    message: `builtin ${value.id} not found`,
                    env: this.env
                }
            } else if (value.forceCount >= b.forceCount) {
                return {
                    kind: "error",
                    message: `too many forces for builtin ${b.name}, ${
                        value.forceCount + 1
                    } > ${b.forceCount}`,
                    env: this.env
                }
            } else {
                return {
                    kind: "reducing",
                    value: {
                        ...value,
                        forceCount: value.forceCount + 1
                    },
                    frames
                }
            }
        } else {
            return {
                kind: "error",
                message: "expected delayed or builtin value for force",
                env: this.env
            }
        }
    }
}
