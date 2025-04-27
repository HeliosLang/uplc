/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { CallSiteInfo, CekContext, CekStack, CekStateChange, CekValue } from "../index.js"
 */

import {
    getLastSelfValue,
    pushStackCallSites,
    pushStackValueAndCallSite
} from "./CekStack.js"

/**
 * Information which is helpful when debugging
 * @typedef {{
 *   callSite?: Site
 *   name?: string
 *   argName?: string
 * }} ApplicationInfo
 */

/**
 * @param {CekValue} leftValue
 * @param {CekValue} rightValue
 * @param {CekStack} frameStack
 * @param {CekContext} ctx
 * @param {ApplicationInfo} info
 * @returns {CekStateChange}
 */
export function applyCekValues(
    leftValue,
    rightValue,
    frameStack,
    ctx,
    info = {}
) {
    if (info.argName) {
        rightValue = {
            ...rightValue,
            name: info.argName
        }
    }

    if ("lambda" in leftValue) {
        /**
         * TODO: cleaner way of getting `self` and other variables that are in the stacks of callbacks
         * @type {CekValue | undefined}
         */
        const lastSelfValue = getLastSelfValue(frameStack)

        /**
         * @type {CallSiteInfo}
         */
        const callSite = {
            site: info.callSite ?? undefined,
            functionName: info.name ?? undefined,
            arguments: lastSelfValue
                ? [lastSelfValue, rightValue]
                : [rightValue]
        }

        return {
            state: {
                computing: {
                    term: leftValue.lambda.term,
                    stack: pushStackValueAndCallSite(
                        leftValue.lambda.stack,
                        rightValue,
                        callSite
                    )
                }
            }
        }
    } else if ("builtin" in leftValue) {
        const b = ctx.getBuiltin(leftValue.builtin.id)

        if (!b) {
            return {
                state: {
                    error: {
                        message: `builtin ${leftValue.builtin.id} not found`,
                        stack: frameStack
                    }
                }
            }
        } else if (b.forceCount > leftValue.builtin.forceCount) {
            return {
                state: {
                    error: {
                        message: `insufficient forces applied to ${b.name}, ${leftValue.builtin.forceCount} < ${b.forceCount}`,
                        stack: frameStack
                    }
                }
            }
        } else {
            const args = leftValue.builtin.args.concat([rightValue])

            if (args.length == b.nArgs) {
                // TODO: reuse from BuiltinCallFrame
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
                            site: info.callSite ?? undefined,
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
                                    ctx.print(
                                        message,
                                        info.callSite ?? undefined
                                    )
                                }
                            })
                        }
                    }
                } catch (e) {
                    return {
                        state: {
                            error: {
                                message: e.message,
                                stack: pushStackCallSites(
                                    frameStack,
                                    ...callSites
                                )
                            }
                        }
                    }
                }
            } else {
                return {
                    state: {
                        reducing: {
                            builtin: {
                                id: leftValue.builtin.id,
                                name: leftValue.builtin.name,
                                forceCount: b.forceCount,
                                args: args
                            }
                        }
                    }
                }
            }
        }
    } else {
        return {
            state: {
                error: {
                    message: `can only call lambda or builtin terms`,
                    stack: frameStack
                }
            }
        }
    }
}
