/**
 * @import { CekFrame, CekStack, CekStateChange, CekTerm, CekValue } from "../index.js"
 */

/**
 * @param {number} tag
 * @param {CekValue[]} evaluatedArgs
 * @param {CekTerm[]} pendingArgs
 * @param {CekStack} stack
 * @returns {CekFrame}
 */
export function makeConstrArgFrame(tag, evaluatedArgs, pendingArgs, stack) {
    return new ConstrArgFrameImpl(tag, evaluatedArgs, pendingArgs, stack)
}

/**
 * @implements {CekFrame}
 */
class ConstrArgFrameImpl {
    /**
     * @readonly
     * @type {number}
     */
    tag

    /**
     * @readonly
     * @type {CekValue[]}
     */
    evaluatedArgs

    /**
     * @readonly
     * @type {CekTerm[]}
     */
    pendingArgs

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @param {number} tag
     * @param {CekValue[]} evaluatedArgs
     * @param {CekTerm[]} pendingArgs
     * @param {CekStack} stack
     */
    constructor(tag, evaluatedArgs, pendingArgs, stack) {
        this.tag = tag
        this.evaluatedArgs = evaluatedArgs
        this.pendingArgs = pendingArgs
        this.stack = stack
    }

    /**
     * @param {CekValue} value
     * @returns {CekStateChange}
     */
    reduce(value) {
        const evaluatedArgs = this.evaluatedArgs.concat([value])

        if (this.pendingArgs.length == 0) {
            return {
                state: {
                    reducing: {
                        constr: {
                            tag: this.tag,
                            args: evaluatedArgs
                        }
                    }
                }
            }
        } else {
            return {
                state: {
                    computing: {
                        term: this.pendingArgs[0],
                        stack: this.stack
                    }
                },
                frames: [
                    makeConstrArgFrame(
                        this.tag,
                        evaluatedArgs,
                        this.pendingArgs.slice(1),
                        this.stack
                    )
                ]
            }
        }
    }
}
