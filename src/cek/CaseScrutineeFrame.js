import { makeLeftApplicationToValueFrame } from "./LeftApplicationToValueFrame.js"

/**
 * @import { CekFrame, CekStack, CekStateChange, CekTerm, CekValue } from "../index.js"
 */

/**
 * @param {CekTerm[]} cases
 * @param {CekStack} stack
 * @returns {CekFrame}
 */
export function makeCaseScrutineeFrame(cases, stack) {
    return new CaseScrutineeFrameImpl(cases, stack)
}

/**
 * @implements {CekFrame}
 */
class CaseScrutineeFrameImpl {
    /**
     * @readonly
     * @type {CekTerm[]}
     */
    cases

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @param {CekTerm[]} cases
     * @param {CekStack} stack
     */
    constructor(cases, stack) {
        this.cases = cases
        this.stack = stack
    }

    /**
     * @param {CekValue} value
     * @returns {CekStateChange}
     */
    reduce(value) {
        if ("constr" in value) {
            const tag = value.constr.tag

            const c = this.cases[tag]

            if (!c) {
                return {
                    state: {
                        error: {
                            message: "constr id out of range",
                            stack: this.stack
                        }
                    }
                }
            }

            const callFrames = value.constr.args.map((a) =>
                makeLeftApplicationToValueFrame(a, this.stack, undefined)
            )

            callFrames.reverse()

            return {
                state: {
                    computing: {
                        term: c,
                        stack: this.stack
                    }
                },
                // TODO: callSite
                frames: callFrames
            }
        } else {
            return {
                state: {
                    error: {
                        message: "expected constr value case",
                        stack: this.stack
                    }
                }
            }
        }
    }
}
