import {
    findUnreportedNamedValues,
    pushStackValueAndCallSites
} from "./CekStack.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CallSiteInfo.js").CallSiteInfo} CallSiteInfo
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame
 * @typedef {import("./CekStack.js").CekStack} CekStack
 * @typedef {import("./CekState.js").CekStateChange} CekStateChange
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

/**
 * Information which is helpful when debugging
 * @typedef {{
 *   callSite?: Option<Site>
 *   name?: Option<string>
 *   argName?: Option<string>
 * }} LambdaCallFrameInfo
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
     * @type {LambdaCallFrameInfo}
     */
    info

    /**
     * @param {CekTerm} term - function body
     * @param {CekStack} stack
     * @param {LambdaCallFrameInfo} info
     */
    constructor(term, stack, info = {}) {
        this.term = term
        this.stack = stack
        this.info = info
    }

    /**
     * @param {CekValue} value - arg value
     * @returns {CekStateChange}
     */
    reduce(value) {
        if (this.info.argName) {
            value = {
                ...value,
                name: this.info.argName
            }
        }

        /**
         * This is needed to report variables like `self`
         * @type {CallSiteInfo[]}
         */
        const callSites = findUnreportedNamedValues(this.stack).map((v) => ({
            argument: v
        }))

        /**
         * @type {CallSiteInfo}
         */
        callSites.push({
            site: this.info.callSite ?? undefined,
            functionName: this.info.name ?? undefined,
            argument: value
        })

        return {
            state: {
                computing: {
                    term: this.term,
                    stack: pushStackValueAndCallSites(
                        this.stack,
                        value,
                        ...callSites
                    )
                }
            }
        }
    }
}
