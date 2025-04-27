import { makeBuiltinCallFrame } from "./BuiltinCallFrame.js"
import { makeLambdaCallFrame } from "./LambdaCallFrame.js"
import { mixStacks } from "./CekStack.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { 
 *   CekContext,
 *   CekFrame,
 *   CekStack,
 *   CekStateChange,
 *   CekTerm,
 *   CekValue
 * } from "../index.js"
 */

/**
 * @param {CekTerm} term
 * @param {CekStack} stack
 * @param {Site | undefined} [callSite]
 * @returns {CekFrame}
 */
export function makeLeftApplicationToTermFrame(
    term,
    stack,
    callSite = undefined
) {
    return new LeftApplicationToTerm(term, stack, callSite)
}

/**
 * @implements {CekFrame}
 */
class LeftApplicationToTerm {
    /**
     * @private
     * @readonly
     * @type {CekTerm}
     */
    _arg

    /**
     * @private
     * @readonly
     * @type {CekStack}
     */
    _stack

    /**
     * @private
     * @readonly
     * @type {Site | undefined}
     */
    _callSite

    /**
     * @param {CekTerm} arg
     * @param {CekStack} stack
     * @param {Site | undefined} callSite
     */
    constructor(arg, stack, callSite) {
        this._arg = arg
        this._stack = stack
        this._callSite = callSite
    }

    /**
     * @param {CekValue} value - fn value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        if ("lambda" in value) {
            return {
                state: {
                    computing: {
                        term: this._arg,
                        stack: this._stack
                    }
                },
                frames: [
                    makeLambdaCallFrame(
                        value.lambda.term,
                        mixStacks(value.lambda.stack, this._stack),
                        {
                            callSite: this._callSite,
                            name: value.name,
                            argName: value.lambda.argName
                        }
                    )
                ]
            }
        } else if ("builtin" in value) {
            const b = ctx.getBuiltin(value.builtin.id)

            if (!b) {
                return {
                    state: {
                        error: {
                            message: `builtin ${value.builtin.id} not found`,
                            stack: this._stack
                        }
                    }
                }
            } else if (b.forceCount > value.builtin.forceCount) {
                return {
                    state: {
                        error: {
                            message: `insufficient forces applied to ${b.name}, ${value.builtin.forceCount} < ${b.forceCount}`,
                            stack: this._stack
                        }
                    }
                }
            } else {
                return {
                    state: {
                        computing: {
                            term: this._arg,
                            stack: this._stack
                        }
                    },
                    frames: [
                        makeBuiltinCallFrame(
                            value.builtin.id,
                            value.builtin.name,
                            value.builtin.args,
                            this._stack,
                            this._callSite
                        )
                    ]
                }
            }
        } else {
            return {
                state: {
                    error: {
                        message: `can only call lambda or builtin terms`,
                        stack: this._stack
                    }
                }
            }
        }
    }
}
