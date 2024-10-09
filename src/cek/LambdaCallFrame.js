import { getLastSelfValue, pushStackValueAndCallSite } from "./CekStack.js"

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
    _info

    /**
     * @param {CekTerm} term - function body
     * @param {CekStack} stack
     * @param {LambdaCallFrameInfo} info
     */
    constructor(term, stack, info = {}) {
        this.term = term
        this.stack = stack
        this._info = info
    }

    /**
     * @param {CekValue} value - arg value
     * @returns {CekStateChange}
     */
    reduce(value) {
        if (this._info.argName) {
            value = {
                ...value,
                name: this._info.argName
            }
        }

        /**
         * TODO: cleaner way of getting `self` and other variables that are in the stacks of callbacks
         * @type {Option<CekValue>}
         */
        const lastSelfValue = getLastSelfValue(this.stack)

        /**
         * @type {CallSiteInfo}
         */
        const callSite = {
            site: this._info.callSite ?? undefined,
            functionName: this._info.name ?? undefined,
            arguments: lastSelfValue ? [lastSelfValue, value] : [value]
        }

        return {
            state: {
                computing: {
                    term: this.term,
                    stack: pushStackValueAndCallSite(
                        this.stack,
                        value,
                        callSite
                    )
                }
            }
        }
    }
}
