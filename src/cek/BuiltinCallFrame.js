import { pushStackCallSite } from "./CekStack.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame
 * @typedef {import("./CekStack.js").CekStack} CekStack
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

/**
 * @implements {CekFrame}
 */
export class BuiltinCallFrame {
    /**
     * @readonly
     * @type {number}
     */
    id

    /**
     * @readonly
     * @type {CekValue[]}
     */
    args

    /**
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
     * @param {number} id
     * @param {CekValue[]} args
     * @param {CekStack} stack
     * @param {Option<Site>} callSite
     */
    constructor(id, args, stack, callSite) {
        this.id = id
        this.args = args
        this.stack = stack
        this.callSite = callSite
    }

    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        const b = ctx.getBuiltin(this.id)

        if (!b) {
            return {
                state: {
                    error: {
                        message: `builtin ${this.id} not found`,
                        stack: this.stack
                    }
                }
            }
        } else if (this.args.length < b.nArgs - 1) {
            return {
                state: {
                    reducing: {
                        builtin: {
                            id: this.id,
                            forceCount: b.forceCount,
                            args: this.args.concat([value])
                        }
                    }
                }
            }
        } else {
            const args = this.args.concat([value])

            ctx.cost.incrArgSizesCost(
                b.name,
                args.map((a) => {
                    if ("value" in a) {
                        return BigInt(a.value.memSize)
                    } else {
                        return 1n
                    }
                })
            )

            try {
                return {
                    state: {
                        reducing: b.call(args, {
                            print: (message) => {
                                ctx.print(message, this.callSite)
                            }
                        })
                    }
                }
            } catch (e) {
                return {
                    state: {
                        error: {
                            message: e.message,
                            stack: pushStackCallSite(this.stack, this.callSite)
                        }
                    }
                }
            }
        }
    }
}
