import { getLastSelfValue, mixStacks, pushStackCallSite } from "./CekStack.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame
 * @typedef {import("./CekStack.js").CekStack} CekStack
 * @typedef {import("./CekValue.js").CekValue} CekValue
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange
 */

/**
 * @implements {CekFrame}
 */
export class ForceFrame {
    /**
     * Used for the parent callsites
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @private
     * @readonly
     * @type {Option<Site>}
     */
    _callSite

    /**
     * @param {CekStack} stack
     * @param {Option<Site>} callSite
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
             * @type {Option<CekValue>}
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
