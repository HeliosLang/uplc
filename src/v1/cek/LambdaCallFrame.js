/**
 * @typedef {import("./types.js").CekContext} CekContext
 */

/**
 * @typedef {import("./types.js").CekFrame} CekFrame
 */

/**
 * @typedef {import("./types.js").CekValue} CekValue
 */

/**
 * @typedef {import("./types.js").CekStateChange} CekStateChange
 */

/**
 * @typedef {import("./types.js").CekTerm} CekTerm
 */

/**
 * @implements {CekFrame}
 */
export class LambdaCallFrame {
    /**
     * @readonly
     * @type {CekTerm}
     */
    term

    /**
     * @readonly
     * @type {CekValue[]}
     */
    stack

    /**
     * @param {CekTerm} term - function body
     * @param {CekValue[]} stack
     */
    constructor(term, stack) {
        this.term = term
        this.stack = stack
    }

    /**
     * @param {CekValue} value
     * @returns {CekStateChange}
     */
    reduce(value) {
        return {
            state: {
                computing: {
                    term: this.term,
                    stack: this.stack.concat([value])
                }
            }
        }
    }
}
