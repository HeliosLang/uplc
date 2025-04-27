import { applyCekValues } from "./applyCekValues.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { CekBuiltinValue, CekContext, CekFrame, CekLambdaValue, CekStateChange, CekStack, CekValue } from "../index.js"
 * @import { ApplicationInfo } from "./applyCekValues.js"
 */

/**
 * @param {CekBuiltinValue | CekLambdaValue} fn
 * @param {CekStack} stack
 * @param {ApplicationInfo} [info]
 * @returns {CekFrame}
 */
export function makeRightApplicationOfValue(fn, stack, info = {}) {
    return new RightApplicationOfValue(fn, stack, info)
}

/**
 * @implements {CekFrame}
 */
class RightApplicationOfValue {
    /**
     * @readonly
     * @type {CekBuiltinValue | CekLambdaValue}
     */
    fn

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @param {CekBuiltinValue | CekLambdaValue} fn
     * @param {CekStack} stack
     * @param {import("./applyCekValues.js").ApplicationInfo} info
     */
    constructor(fn, stack, info) {
        this.fn = fn
        this.stack = stack
        this.info = info
    }

    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        return applyCekValues(this.fn, value, this.stack, ctx, this.info)
    }
}
