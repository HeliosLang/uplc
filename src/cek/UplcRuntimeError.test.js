import { strictEqual, match, deepEqual } from "node:assert"
import { describe, it } from "node:test"
import { TokenSite } from "@helios-lang/compiler-utils"
import { expectSome } from "@helios-lang/type-utils"
import {
    UplcBuiltin,
    UplcCall,
    UplcConst,
    UplcDelay,
    UplcError,
    UplcForce,
    UplcVar
} from "../terms/index.js"
import { UplcString } from "../values/index.js"
import { UplcRuntimeError } from "./UplcRuntimeError.js"

/**
 * @typedef {import("./CallSiteInfo.js").CallSiteInfo} CallSiteInfo
 */

describe(UplcRuntimeError.name, () => {
    /**
     * @type {CallSiteInfo[]}
     */
    const callSites = [
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 1,
                startColumn: 16,
                endLine: 1,
                endColumn: 17
            }),
            functionName: undefined,
            arguments: [
                {
                    name: "fn3",
                    delay: {
                        term: new UplcForce(
                            new UplcCall(
                                new UplcCall(
                                    new UplcForce(new UplcBuiltin(28, "trace")),
                                    new UplcConst(new UplcString("my error"))
                                ),
                                new UplcDelay(new UplcError())
                            )
                        ),
                        stack: {
                            // not used by UplcRuntimeError
                            values: [],
                            callSites: []
                        }
                    }
                }
            ]
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 6,
                startColumn: 16,
                endLine: 6,
                endColumn: 17
            }),
            functionName: undefined,
            arguments: [
                {
                    name: "fn2",
                    delay: {
                        term: new UplcForce(new UplcVar(1, "fn3")),
                        stack: {
                            // not used by UplcRuntimeError
                            values: [],
                            callSites: []
                        }
                    }
                }
            ]
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 9,
                startColumn: 16,
                endLine: 9,
                endColumn: 17
            }),
            functionName: undefined,
            arguments: [
                {
                    name: "fn1",
                    delay: {
                        term: new UplcForce(new UplcVar(1, "fn2")),
                        stack: {
                            // not used by UplcRuntimeError
                            values: [],
                            callSites: []
                        }
                    }
                }
            ]
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 12,
                startColumn: 15,
                endLine: 12,
                endColumn: 16
            }),
            functionName: "fn1"
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 10,
                startColumn: 19,
                endLine: 10,
                endColumn: 20
            }),
            functionName: "fn2"
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 7,
                startColumn: 19,
                endLine: 7,
                endColumn: 20
            }),
            functionName: "fn3"
        },
        {
            site: new TokenSite({
                file: "unknown",
                startLine: 4,
                startColumn: 18,
                endLine: 4,
                endColumn: 19
            }),
            functionName: undefined
        }
    ]

    try {
        throw new UplcRuntimeError("my error", callSites)
    } catch (err) {
        if (err instanceof UplcRuntimeError) {
            const stack = expectSome(err.stack)

            // in Node the error message is part of the stack itself, so we ignore it for the sake of the test (checking the err.message field directly instead)
            it("message property correctly set", () => {
                strictEqual(err.message, "my error")
            })

            it("frames property correctly set", () => {
                deepEqual(err.frames, callSites)
            })

            const lines = stack.split("\n").slice(1)

            it("stack trace lines related to UPLC evaluation have expected format", () => {
                strictEqual(lines[0].trim(), "at fn3 (helios:unknown:5:19)")
                strictEqual(lines[1].trim(), "at fn2 (helios:unknown:8:20)")
                strictEqual(lines[2].trim(), "at fn1 (helios:unknown:11:20)")
                strictEqual(
                    lines[3].trim(),
                    "at <anonymous> (helios:unknown:13:16) [fn1=(delay (force fn2))]"
                )
                strictEqual(
                    lines[4].trim(),
                    "at <anonymous> (helios:unknown:10:17) [fn2=(delay (force fn3))]"
                )
                strictEqual(
                    lines[5].trim(),
                    'at <anonymous> (helios:unknown:7:17) [fn3=(delay (force [[(force (builtin 28)) (con string "my error")] (delay (error))]))]'
                )
                strictEqual(
                    lines[6].trim(),
                    "at <anonymous> (helios:unknown:2:17)"
                )
            })

            it("stack trace continues with JS stack trace in this file", () => {
                match(lines[7], /UplcRuntimeError.test.js/)
            })
        } else {
            throw new Error(
                "expected an instance of Error, got " + err.toString()
            )
        }
    }
})
