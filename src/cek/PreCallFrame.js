import { BuiltinCallFrame } from "./BuiltinCallFrame.js"
import { LambdaCallFrame } from "./LambdaCallFrame.js"

/**
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./types.js").CekFrame} CekFrame
 * @typedef {import("./types.js").CekStack} CekStack
 * @typedef {import("./types.js").CekStateChange} CekStateChange
 * @typedef {import("./types.js").CekTerm} CekTerm
 * @typedef {import("./types.js").CekValue} CekValue
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
     * @param {CekTerm} arg
     * @param {CekStack} stack
     */
    constructor(arg, stack) {
        this.arg = arg
        this.stack = stack
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
                    value.lambda.stack
                )
            }
        } else if ("builtin" in value) {
            const b = ctx.getBuiltin(value.builtin.id)

            if (!b) {
                return {
                    state: {
                        error: {
                            message: `builtin ${value.builtin.id} not found`
                        }
                    }
                }
            } else if (b.forceCount > value.builtin.forceCount) {
                return {
                    state: {
                        error: {
                            message: `insufficient forces applied to ${b.name}, ${value.builtin.forceCount} < ${b.forceCount}`
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
                        value.builtin.args
                    )
                }
            }
        } else {
            return {
                state: {
                    error: {
                        message: `can only call lambda or builtin terms`
                    }
                }
            }
        }
    }
}
