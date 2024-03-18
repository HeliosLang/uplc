/**
 * @typedef {import("./CekContext.js").CekContext} CekContext
 */

/**
 * @typedef {import("./types.js").CekFrame} CekFrame
 */

/**
 * @typedef {import("./types.js").CekStateChange} CekStateChange
 */

/**
 * @typedef {import("./types.js").CekValue} CekValue
 */

/**
 * @implements {CekFrame}
 */
export class BuiltinCallFrame {
    /**
     * @param {number} id
     * @param {CekValue[]} args
     */
    constructor(id, args) {
        this.id = id
        this.args = args
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
                        message: `builtin ${this.id} not found`
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
                        reducing: b.call(args, ctx)
                    }
                }
            } catch (e) {
                return {
                    state: {
                        error: {
                            message: e.message
                        }
                    }
                }
            }
        }
    }
}
