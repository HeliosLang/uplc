import { strictEqual, match } from "node:assert"
import { describe } from "node:test"
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
            site: new TokenSite("unknown", 1, 16, 1, 17),
            functionName: undefined,
            argument: {
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
        },
        {
            site: new TokenSite("unknown", 6, 16, 6, 17),
            functionName: undefined,
            argument: {
                delay: {
                    term: new UplcDelay(new UplcForce(new UplcVar(1, "fn2"))),
                    stack: {
                        // not used by UplcRuntimeError
                        values: [],
                        callSites: []
                    }
                }
            }
        },
        {
            site: new TokenSite("unknown", 9, 16, 9, 17),
            functionName: undefined,
            argument: {
                delay: {
                    term: new UplcDelay(new UplcForce(new UplcVar(1, "fn1"))),
                    stack: {
                        // not used by UplcRuntimeError
                        values: [],
                        callSites: []
                    }
                }
            }
        },
        {
            site: new TokenSite("unknown", 12, 15, 12, 16),
            functionName: "fn1"
        },
        {
            site: new TokenSite("unknown", 10, 19, 10, 20),
            functionName: "fn2"
        },
        {
            site: new TokenSite("unknown", 7, 19, 7, 20),
            functionName: "fn3"
        },
        {
            site: new TokenSite("unknown", 4, 18, 4, 19),
            functionName: undefined
        }
    ]

    try {
        throw new UplcRuntimeError("my error", callSites)
    } catch (err) {
        if (err instanceof Error) {
            const stack = expectSome(err.stack)

            // in Node the error message is part of the stack itself, so we ignore it for the sake of the test (checking the err.message field directly instead)
            strictEqual(err.message, "my error")

            const lines = stack.split("\n").slice(1)

            strictEqual(lines[0].trim(), "at fn3 (helios:unknown:5:19)")
            strictEqual(lines[1].trim(), "at fn2 (helios:unknown:8:20)")
            strictEqual(lines[2].trim(), "at fn1 (helios:unknown:11:20)")
            strictEqual(
                lines[3].trim(),
                "at <anonymous> (helios:unknown:13:16)"
            )
            strictEqual(
                lines[4].trim(),
                "at <anonymous> (helios:unknown:10:17)"
            )
            strictEqual(lines[5].trim(), "at <anonymous> (helios:unknown:7:17)")
            strictEqual(lines[6].trim(), "at <anonymous> (helios:unknown:2:17)")
            match(lines[7], /UplcRuntimeError.test.js/)
        } else {
            throw new Error(
                "expected an instance of Error, got " + err.toString()
            )
        }
    }
})
