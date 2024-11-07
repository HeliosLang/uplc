import { getLastSelfValue, mixStacks, pushStackCallSite } from "./CekStack.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { AssertExtends } from "@helios-lang/type-utils"
 * @import { CekContext, CekFrame, CekStack, CekStateChange, CekValue } from "src/index.js"
 */

/**
 * @typedef {object} ForceFrame
 * @prop {CekStack} stack
 * @prop {(value: CekValue, ctx: CekContext) => CekStateChange} reduce
 */

/**
 * @typedef {AssertExtends<CekFrame, ForceFrame>} _ForceFrameExtendsCekFrame
 */

/**
 * @param {CekStack} stack
 * @param {Site | undefined} callSite
 * @returns {ForceFrame}
 */
export function makeForceFrame(stack, callSite) {
    return new ForceFrameImpl(stack, callSite)
}

/**
 * @implements {CekFrame}
 */
class ForceFrameImpl {
    /**
     * Used for the parent callsites
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @private
     * @readonly
     * @type {Site | undefined}
     */
    _callSite

    /**
     * @param {CekStack} stack
     * @param {Site | undefined} callSite
     */
    constructor(stack, callSite) {
        this.stack = stack
        this._callSite = callSite
    }

    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        if ("delay" in value) {
            const delay = value.delay

            /**
             * TODO: cleaner way of getting `self` and other variables that are in the stacks of callbacks
             * @type {CekValue | undefined}
             */
            const lastSelfValue = getLastSelfValue(delay.stack)

            return {
                state: {
                    computing: {
                        term: delay.term,
                        stack: mixStacks(
                            delay.stack,
                            pushStackCallSite(this.stack, {
                                site: this._callSite ?? undefined,
                                functionName: value.name,
                                arguments: lastSelfValue
                                    ? [lastSelfValue]
                                    : undefined
                            })
                        )
                    }
                }
            }
        } else if ("builtin" in value) {
            const b = ctx.getBuiltin(value.builtin.id)

            if (!b) {
                return {
                    state: {
                        error: {
                            message: `builtin ${value.builtin.id} not found`,
                            stack: this.stack
                        }
                    }
                }
            } else if (value.builtin.forceCount >= b.forceCount) {
                return {
                    state: {
                        error: {
                            message: `too many forces for builtin ${b.name}, ${
                                value.builtin.forceCount + 1
                            } > ${b.forceCount}`,
                            stack: this.stack
                        }
                    }
                }
            } else {
                return {
                    state: {
                        reducing: {
                            builtin: {
                                ...value.builtin,
                                forceCount: value.builtin.forceCount + 1
                            }
                        }
                    }
                }
            }
        } else {
            return {
                state: {
                    error: {
                        message: "expected delayed or builtin value for force",
                        stack: this.stack
                    }
                }
            }
        }
    }
}
