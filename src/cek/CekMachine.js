import { makeCostTracker } from "../costmodel/index.js"
import { stringifyNonUplcValue } from "./CekValue.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import {
 *   Builtin,
 *   CekMachine,
 *   CekResult,
 *   CekEnv,
 *   CekState,
 *   CekTerm,
 *   CostModel,
 *   CostTracker,
 *   UplcLogger,
 *   UplcValue
 * } from "../index.js"
 */

/**
 * Initialize a `CekMachine` in a CekComputingState with the given term
 * @param {CekTerm} term
 * @param {Builtin[]} builtins
 * @param {CostModel} costModel
 * @param {UplcLogger | undefined} [diagnostics]
 * @returns {CekMachine}
 */
export function makeCekMachine(term, builtins, costModel, diagnostics) {
    return new CekMachineImpl(term, builtins, costModel, diagnostics)
}

/**
 * @implements {CekMachine}
 */
class CekMachineImpl {
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
     * @type {CekState}
     */
    state

    /**
     * @type {{message: string, site?: Site}[]}     *
     */
    logs

    /**
     * @type {UplcLogger | undefined}
     */
    diagnostics

    /**
     * Initializes in computing state
     * @param {CekTerm} term
     * @param {Builtin[]} builtins
     * @param {CostModel} costModel
     * @param {UplcLogger | undefined} [diagnostics]
     */
    constructor(term, builtins, costModel, diagnostics = undefined) {
        this.builtins = builtins
        this.cost = makeCostTracker(costModel)
        this.logs = []

        this.diagnostics = diagnostics

        this.state = {
            kind: "computing",
            term,
            env: {
                values: [],
                callSites: []
            },
            frames: []
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
     * @param {string} message
     * @param {Site | undefined} site
     */
    print(message, site = undefined) {
        this.logs.push({ message, site: site ?? undefined })
        this.diagnostics?.logPrint(message, site)
    }

    /**
     * @returns {CekResult}
     */
    eval() {
        this.cost.incrStartupCost()

        while (!["error", "success"].includes(this.state.kind)) {
            if (this.state.kind == "computing") {
                const { term, env, frames } = this.state

                this.state = term.compute(frames, env, this)
            } else if (this.state.kind == "reducing") {
                const f = this.state.frames.pop()

                if (f) {
                    const newState = f.reduce(
                        this.state.frames,
                        this.state.value,
                        this
                    )

                    this.state = newState
                } else {
                    this.state = {
                        kind: "success",
                        value: this.state.value
                    }
                }
            }
        }

        if (this.state.kind == "success") {
            return this.returnValue(stringifyNonUplcValue(this.state.value))
        } else if (this.state.kind == "error") {
            return this.returnError(this.state.message, this.state.env)
        } else {
            throw new Error(
                `Internal error: unexpected final state ${this.state.kind}`
            )
        }
    }

    /**
     * @private
     * @param {string} message
     * @param {CekEnv} env
     * @returns {CekResult}
     */
    returnError(message, env) {
        return {
            result: {
                left: {
                    error: message,
                    callSites: env.callSites
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
}
