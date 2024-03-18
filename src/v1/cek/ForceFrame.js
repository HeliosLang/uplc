/**
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./types.js").CekFrame} CekFrame
 * @typedef {import("./types.js").CekValue} CekValue
 * @typedef {import("./types.js").CekStateChange} CekStateChange
 */

/**
 * @implements {CekFrame}
 */
export class ForceFrame {
    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        if ("delay" in value) {
            return {
                state: {
                    computing: value.delay
                }
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
            } else if (value.builtin.forceCount >= b.forceCount) {
                return {
                    state: {
                        error: {
                            message: `too many forces for builtin ${b.name}, ${
                                value.builtin.forceCount + 1
                            } > ${b.forceCount}`
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
                        message: "expected delayed or builtin value for force"
                    }
                }
            }
        }
    }
}
