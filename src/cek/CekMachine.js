import { None } from "@helios-lang/type-utils"
import { CostTracker, CostModel } from "../costmodel/index.js"
import { stringifyNonUplcValue } from "./CekValue.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 * @typedef {import("../costmodel/index.js").Cost} Cost
 * @typedef {import("../logging/index.js").UplcLoggingI} UplcLoggingI
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CekContext.js").CekContext} CekContext
 * @typedef {import("./CekFrame.js").CekFrame} CekFrame
 * @typedef {import("./CekResult.js").CekResult} CekResult
 * @typedef {import("./CekStack.js").CekStack} CekStack
 * @typedef {import("./CekState.js").CekState} CekState
 * @typedef {import("./CekTerm.js").CekTerm} CekTerm
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
     * @private
     * @type {{message: string, site?: Site}[]}     *
     */
    logs

    /**
     * @type {Option<UplcLoggingI>}
     */
    diagnostics

    /**
     * Initializes in computing state
     * @param {CekTerm} term
     * @param {Builtin[]} builtins
     * @param {CostModel} costModel
     * @param {UplcLoggingI} [diagnostics]
     */
    constructor(term, builtins, costModel, diagnostics) {
        this.builtins = builtins
        this.cost = new CostTracker(costModel)
        this.frames = []
        this.logs = []

        this.diagnostics = diagnostics

        this.state = {
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
        return this.logs.pop()?.message
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
                    return this.returnValue(
                        stringifyNonUplcValue(this.state.reducing)
                    )
                }
            } else if ("error" in this.state) {
                return this.returnError(this.state.error)
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
            logs: this.logs,
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
            logs: this.logs,
            breakdown: this.cost.breakdown
        }
    }

    /**
     * @param {string} message
     * @param {Option<Site>} site
     */
    print(message, site = None) {
        this.logs.push({ message, site: site ?? undefined })
        this.diagnostics?.logPrint(message, site)
    }
}
