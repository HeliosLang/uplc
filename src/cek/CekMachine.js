import { makeCostTracker } from "../costmodel/index.js"
import { stringifyNonUplcValue } from "./CekValue.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   Builtin,
 *   CekContext,
 *   CekFrame,
 *   CekResult,
 *   CekStack,
 *   CekState,
 *   CekTerm,
 *   CostModel,
 *   CostTracker,
 *   UplcLogger,
 *   UplcValue
 * } from "../index.js"
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
    _frames

    /**
     * @private
     * @type {CekState}
     */
    _state

    /**
     * @private
     * @type {{message: string, site?: Site}[]}     *
     */
    _logs

    /**
     * @type {UplcLogger | undefined}
     */
    diagnostics

    /**
     * Initializes in computing state
     * @param {CekTerm} term
     * @param {Builtin[]} builtins
     * @param {CostModel} costModel
     * @param {UplcLogger} [diagnostics]
     */
    constructor(term, builtins, costModel, diagnostics) {
        this.builtins = builtins
        this.cost = makeCostTracker(costModel)
        this._frames = []
        this._logs = []

        this.diagnostics = diagnostics

        this._state = {
            computing: {
                term,
                stack: {
                    values: [],
                    callSites: []
                }
            }
        }
    }

    /**
     * @returns {string | undefined}
     */
    popLastMessage() {
        return this._logs.pop()?.message
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

        while (true) {
            if ("computing" in this._state) {
                const { term, stack } = this._state.computing

                const { state: newState, frames: newFrames } = term.compute(
                    stack,
                    this
                )

                this._state = newState

                if (newFrames) {
                    for (let newFrame of newFrames) {
                        this._frames.push(newFrame)
                    }
                }
            } else if ("reducing" in this._state) {
                const f = this._frames.pop()

                if (f) {
                    const { state: newState, frames: newFrames } = f.reduce(
                        this._state.reducing,
                        this
                    )

                    this._state = newState

                    if (newFrames) {
                        for (let newFrame of newFrames) {
                            this._frames.push(newFrame)
                        }
                    }
                } else {
                    return this.returnValue(
                        stringifyNonUplcValue(this._state.reducing)
                    )
                }
            } else if ("error" in this._state) {
                return this.returnError(this._state.error)
            }
        }
    }

    /**
     * @private
     * @param {{message: string, stack: CekStack}} err
     * @returns {CekResult}
     */
    returnError(err) {
        return {
            result: {
                left: {
                    error: err.message,
                    callSites: err.stack.callSites
                }
            },
            cost: {
                mem: this.cost.mem,
                cpu: this.cost.cpu
            },
            logs: this._logs,
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
            logs: this._logs,
            breakdown: this.cost.breakdown
        }
    }

    /**
     * @param {string} message
     * @param {Site | undefined} site
     */
    print(message, site = undefined) {
        this._logs.push({ message, site: site ?? undefined })
        this.diagnostics?.logPrint(message, site)
    }
}
