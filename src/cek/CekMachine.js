import { expectSome } from "@helios-lang/type-utils"
import { CostTracker, CostModel } from "../costmodel/index.js"

/**
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../costmodel/index.js").Cost} Cost
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekResult.js").CekResult} CekResult
 * @typedef {import("./types.js").CekFrame} CekFrame
 * @typedef {import("./types.js").CekState} CekState
 * @typedef {import("./types.js").CekTerm} CekTerm
 */

/**
 * @implements {CekContext}
 */
export class CekMachine {
    /**
     * @readonly
     * @type {Builtin[]}
     */
    builtins

    /**
     * @readonly
     * @type {CostTracker}
     */
    cost

    /**
     * @private
     * @readonly
     * @type {CekFrame[]}
     */
    frames

    /**
     * @private
     * @type {CekState}
     */
    state

    /**
     * Initializes in computing state
     * @param {CekTerm} term
     * @param {Builtin[]} builtins
     * @param {CostModel} costModel
     */
    constructor(term, builtins, costModel) {
        this.builtins = builtins

        this.cost = new CostTracker(costModel)

        this.frames = []

        this.state = {
            computing: {
                term,
                stack: []
            }
        }
    }

    /**
     * @param {number} id
     * @returns {Builtin | undefined}
     */
    getBuiltin(id) {
        return this.builtins[id]
    }

    /**
     * @returns {CekResult}
     */
    eval() {
        this.cost.incrStartupCost()

        let i = 0
        while (true) {
            if ("computing" in this.state) {
                const { term, stack } = this.state.computing

                const { state: newState, frame: newFrame } = term.compute(
                    stack,
                    this
                )

                this.state = newState

                if (newFrame) {
                    this.frames.push(newFrame)
                }
            } else if ("reducing" in this.state) {
                const f = this.frames.pop()

                if (f) {
                    const { state: newState, frame: newFrame } = f.reduce(
                        this.state.reducing,
                        this
                    )

                    this.state = newState

                    if (newFrame) {
                        this.frames.push(newFrame)
                    }
                } else {
                    if ("value" in this.state.reducing) {
                        return this.returnValue(this.state.reducing.value)
                    } else if ("delay" in this.state.reducing) {
                        return this.returnValue(
                            `(delay ${this.state.reducing.delay.term.toString()})`
                        )
                    } else if ("builtin" in this.state.reducing) {
                        const builtin = expectSome(
                            this.getBuiltin(this.state.reducing.builtin.id)
                        )
                        return this.returnValue(builtin.name)
                    } else {
                        const props = this.state.reducing.lambda

                        return this.returnValue(
                            `(lam ${
                                props.argName ? `${props.argName} ` : ""
                            }${props.term.toString()})`
                        )
                    }
                }
            } else if ("error" in this.state) {
                return this.returnError(this.state.error.message)
            }
        }
    }

    /**
     * @private
     * @param {string} msg
     * @returns {CekResult}
     */
    returnError(msg) {
        return {
            result: {
                left: {
                    error: msg
                }
            },
            cost: {
                mem: this.cost.mem,
                cpu: this.cost.cpu
            },
            breakdown: this.cost.breakdown
        }
    }

    /**
     * @private
     * @param {string | UplcValue} value
     * @returns {CekResult}
     */
    returnValue(value) {
        return {
            result: {
                right: value
            },
            cost: {
                mem: this.cost.mem,
                cpu: this.cost.cpu
            },
            breakdown: this.cost.breakdown
        }
    }
    /**
     * @param {string} message
     */
    print(message) {
        console.log(message)
    }
}
