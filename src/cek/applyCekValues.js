import {
    getLastSelfValue,
    pushStackCallSites,
    pushStackValueAndCallSite
} from "./CekEnv.js"

/**
 * @import {
 *   CekApplyInfo,
 *   CallSiteInfo,
 *   CekContext,
 *   CekFrame,
 *   CekEnv,
 *   CekState,
 *   CekValue
 * } from "../index.js"
 */

/**
 * If the `leftValue` is a lambda function, perform the following transition:
 *
 * $$
 * [\langle\text{lam}~x~M~\rho\rangle~V]
 * $$
 * @param {CekFrame[]} frames
 * @param {CekValue} leftValue
 * @param {CekValue} rightValue
 * @param {CekEnv} frameStack
 * @param {CekContext} ctx
 * @param {CekApplyInfo} info
 * @returns {CekState}
 */
export function applyCekValues(
    frames,
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

    if (leftValue.kind == "lambda") {
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
            kind: "computing",
            term: leftValue.body,
            env: pushStackValueAndCallSite(leftValue.env, rightValue, callSite),
            frames
        }
    } else if (leftValue.kind == "builtin") {
        const b = ctx.getBuiltin(leftValue.id)

        if (!b) {
            return {
                kind: "error",
                message: `builtin ${leftValue.id} not found`,
                env: frameStack
            }
        } else if (b.forceCount > leftValue.forceCount) {
            return {
                kind: "error",
                message: `insufficient forces applied to ${b.name}, ${leftValue.forceCount} < ${b.forceCount}`,
                env: frameStack
            }
        } else {
            const args = leftValue.args.concat([rightValue])

            if (args.length == b.nArgs) {
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
                        kind: "reducing",
                        value: b.call(args, {
                            print: (message) => {
                                ctx.print(message, info.callSite ?? undefined)
                            }
                        }),
                        frames
                    }
                } catch (e) {
                    return {
                        kind: "error",
                        message: e.message,
                        env: pushStackCallSites(frameStack, ...callSites)
                    }
                }
            } else {
                return {
                    kind: "reducing",
                    value: {
                        kind: "builtin",
                        id: leftValue.id,
                        name: leftValue.name,
                        forceCount: b.forceCount,
                        args: args
                    },
                    frames
                }
            }
        }
    } else {
        return {
            kind: "error",
            message: `can only call lambda or builtin terms`,
            env: frameStack
        }
    }
}
