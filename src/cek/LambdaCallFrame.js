import { getLastSelfValue, pushStackValueAndCallSite } from "./CekStack.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { AssertExtends } from "@helios-lang/type-utils"
 * @import { CallSiteInfo, CekContext, CekFrame, CekStack, CekStateChange, CekTerm, CekValue } from "src/index.js"
 */

/**
 * Information which is helpful when debugging
 * @typedef {{
 *   callSite?: Site
 *   name?: string
 *   argName?: string
 * }} LambdaCallFrameInfo
 */

/**
 * @typedef {object} LambdaCallFrame
 * @prop {CekTerm} term
 * @prop {CekStack} stack
 * @prop {(value: CekValue) => CekStateChange} reduce
 */

/**
 * @typedef {AssertExtends<CekFrame, LambdaCallFrame>} _LambdaCallFrameExtendsCekFrame
 */

/**
 * @param {CekTerm} term
 * @param {CekStack} stack
 * @param {LambdaCallFrameInfo} info
 * @returns {LambdaCallFrame}
 */
export function makeLambdaCallFrame(term, stack, info = {}) {
    return new LambdaCallFrameImpl(term, stack, info)
}

/**
 * @implements {LambdaCallFrame}
 */
class LambdaCallFrameImpl {
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
         * @type {CekValue | undefined}
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
