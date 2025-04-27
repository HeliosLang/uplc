import { expectDefined } from "@helios-lang/type-utils"
import { applyCekValues } from "./applyCekValues.js"
import { pushStackCallSites } from "./CekStack.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { AssertExtends } from "@helios-lang/type-utils"
 * @import { CallSiteInfo, CekContext, CekFrame, CekStack, CekStateChange, CekValue } from "../index.js"
 */

/**
 * @typedef {object} BuiltinCallFrame
 * @prop {number} id
 * @prop {string} name
 * @prop {CekValue[]} args
 * @prop {CekStack} stack
 * @prop {(value: CekValue, ctx: CekContext) => CekStateChange} reduce
 */

/**
 * @typedef {AssertExtends<CekFrame, BuiltinCallFrame>} _BuiltinCallFrameExtendsCekFrame
 */

/**
 * Creates a new BuiltinCallFrame
 * @param {number} id
 * @param {string} name
 * @param {CekValue[]} args
 * @param {CekStack} stack
 * @param {Site | undefined} callSite
 * @returns {BuiltinCallFrame}
 */
export function makeBuiltinCallFrame(id, name, args, stack, callSite) {
    return new BuiltinCallFrameImpl(id, name, args, stack, callSite)
}

/**
 * TODO: get rid of this as it isn't required according to the CEK machine specifications
 * @implements {BuiltinCallFrame}
 */
class BuiltinCallFrameImpl {
    /**
     * @readonly
     * @type {number}
     */
    id

    /**
     * @readonly
     * @type {string}
     */
    name

    /**
     * @readonly
     * @type {CekValue[]}
     */
    args

    /**
     * @readonly
     * @type {CekStack}
     */
    stack

    /**
     * @private
     * @readonly
     * @type {Site | undefined}
     */
    _callSite

    /**
     * @param {number} id
     * @param {string} name
     * @param {CekValue[]} args
     * @param {CekStack} stack
     * @param {Site | undefined} callSite
     */
    constructor(id, name, args, stack, callSite) {
        this.id = id
        this.name = name
        this.args = args
        this.stack = stack
        this._callSite = callSite
    }

    /**
     * @param {CekValue} value
     * @param {CekContext} ctx
     * @returns {CekStateChange}
     */
    reduce(value, ctx) {
        const b = expectDefined(ctx.getBuiltin(this.id))

        return applyCekValues(
            {
                builtin: {
                    id: this.id,
                    name: this.name,
                    forceCount: b?.forceCount,
                    args: this.args
                }
            },
            value,
            this.stack,
            ctx
        )

        if (!b) {
            return {
                state: {
                    error: {
                        message: `builtin ${this.name} (${this.id}) not found`,
                        stack: this.stack
                    }
                }
            }
        } else if (this.args.length < b.nArgs - 1) {
            return {
                state: {
                    reducing: {
                        builtin: {
                            id: this.id,
                            name: this.name,
                            forceCount: b.forceCount,
                            args: this.args.concat([value])
                        }
                    }
                }
            }
        } else {
            const args = this.args.concat([value])

            ctx.cost.incrArgSizesCost(
                b.name,
                args.map((a) => {
                    if ("value" in a) {
                        return BigInt(a.value.memSize)
                    } else {
                        return 1n
                    }
                })
            )

            /**
             * @type {CallSiteInfo[]}
             */
            const callSites = args.map((a, i) => {
                if (i == args.length - 1) {
                    return {
                        site: this._callSite,
                        functionName: b.name,
                        argument: a
                    }
                } else {
                    return {
                        argument: a
                    }
                }
            })

            try {
                return {
                    state: {
                        reducing: b.call(args, {
                            print: (message) => {
                                ctx.print(message, this._callSite)
                            }
                        })
                    }
                }
            } catch (e) {
                return {
                    state: {
                        error: {
                            message: e.message,
                            stack: pushStackCallSites(this.stack, ...callSites)
                        }
                    }
                }
            }
        }
    }
}
