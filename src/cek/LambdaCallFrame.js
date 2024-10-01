import { pushStackValueAndCallSite } from "./CekStack.js"

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
     * @private
     * @readonly
     * @type {Option<Site>}
     */
    callSite

    /**
     * @param {CekTerm} term - function body
     * @param {CekStack} stack
     * @param {Option<Site>} callSite
     */
    constructor(term, stack, callSite) {
        this.term = term
        this.stack = stack
        this.callSite = callSite
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
                    stack: pushStackValueAndCallSite(
                        this.stack,
                        value,
                        this.callSite
                    )
                }
            }
        }
    }
}
