import { BuiltinCallFrame } from "./BuiltinCallFrame.js"
import { LambdaCallFrame } from "./LambdaCallFrame.js"
import { mixStacks } from "./CekStack.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame
 * @typedef {import("./CekStack.js").CekStack} CekStack
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

/**
 * @implements {CekFrame}
 */
export class PreCallFrame {
    /**
     * @private
     * @readonly
     * @type {CekTerm}
     */
    arg

    /**
     * @private
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @private
     * @readonly
     * @type {Option<Site>}
     */
    callSite

    /**
     * @param {CekTerm} arg
     * @param {CekStack} stack
     * @param {Option<Site>} callSite
     */
    constructor(arg, stack, callSite) {
        this.arg = arg
        this.stack = stack
        this.callSite = callSite
    }

    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        if ("lambda" in value) {
            return {
                state: {
                    computing: {
                        term: this.arg,
                        stack: this.stack
                    }
                },
                frame: new LambdaCallFrame(
                    value.lambda.term,
                    mixStacks(value.lambda.stack, this.stack),
                    this.callSite
                )
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
            } else if (b.forceCount > value.builtin.forceCount) {
                return {
                    state: {
                        error: {
                            message: `insufficient forces applied to ${b.name}, ${value.builtin.forceCount} < ${b.forceCount}`,
                            stack: this.stack
                        }
                    }
                }
            } else {
                return {
                    state: {
                        computing: {
                            term: this.arg,
                            stack: this.stack
                        }
                    },
                    frame: new BuiltinCallFrame(
                        value.builtin.id,
                        value.builtin.args,
                        this.stack,
                        this.callSite
                    )
                }
            }
        } else {
            return {
                state: {
                    error: {
                        message: `can only call lambda or builtin terms`,
                        stack: this.stack
                    }
                }
            }
        }
    }
}
