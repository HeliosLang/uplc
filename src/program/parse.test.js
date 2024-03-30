import { describe, it } from "node:test"
import { strictEqual } from "node:assert"
import { builtinsV1 } from "../builtins/index.js"
import { parseProgram } from "./parse.js"

describe(parseProgram.name, () => {
    const src = "(program 1.0.0 (con bool False))"

    it(`parse ${src} successfully`, () => {
        const term = parseProgram(src, {
            uplcVersion: "1.0.0",
            builtins: builtinsV1
        })

        strictEqual(term.toString().includes("false"), true)
    })
})
