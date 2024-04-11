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
export class LambdaCallFrame {
    /**
     * @readonly
     * @type {CekTerm}
     */
    term

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @param {CekTerm} term - function body
     * @param {CekStack} stack
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
                    stack: {
                        values: this.stack.values.concat([value]),
                        callSites: this.stack.callSites
                    }
                }
            }
        }
    }
}
