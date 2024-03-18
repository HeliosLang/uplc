import { builtins } from "../builtins/index.js"
import {
    DEFAULT_COST_MODEL_PARAMS,
    CostTracker,
    CostModel
} from "../costmodel/index.js"

/**
 * @typedef {import("../builtins/index.js").Builtin} Builtin
 */

/**
 * @typedef {import("../costmodel/index.js").Cost} Cost
 */

/**
 * @typedef {import("../costmodel/index.js").CostModelParams} CostModelParams
 */

/**
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {import("./CekContext.js").CekContext} CekContext
 */

/**
 * @typedef {import("./types.js").CekFrame} CekFrame
 */

/**
 * @typedef {import("./types.js").CekState} CekState
 */

/**
 * @typedef {import("./types.js").CekTerm} CekTerm
 */

/**
 * @implements {CekContext}
 */
export class CekMachine {
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
     * @param {CostModelParams} costModelParams
     */
    constructor(term, costModelParams = DEFAULT_COST_MODEL_PARAMS) {
        this.cost = new CostTracker(new CostModel(costModelParams, builtins))

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
        return builtins[id]
    }

    /**
     *
     * @returns {UplcValue}
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
                    if ("value" in this.state.reducing) {
                        return this.state.reducing.value
                    } else {
                        throw new Error("expected UplcValue return value")
                    }
                }
            } else if ("error" in this.state) {
                throw new Error(this.state.error.message)
            }
        }
    }

    /**
     * @param {string} message
     */
    print(message) {
        console.log(message)
    }
}
