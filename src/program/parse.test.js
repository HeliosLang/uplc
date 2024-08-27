import { describe, it } from "node:test"
import { strictEqual, throws } from "node:assert"
import { builtinsV1, builtinsV3 } from "../builtins/index.js"
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

    it(`fails to parse bad Bls12_381 G1 syntax (missing 0x)`, () => {
        const src = `(
            program 1.1.0 (
                con bls12_381_G1_element c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
            )
        )`

        throws(() =>
            parseProgram(src, {
                uplcVersion: "1.1.0",
                builtins: builtinsV3
            })
        )
    })

    it(`fails to parse bad Bls12_381 G1 syntax (# instead of 0x)`, () => {
        const src = `(
            program 1.1.0 (
                con bls12_381_G1_element #c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
            )
        )`

        throws(() =>
            parseProgram(src, {
                uplcVersion: "1.1.0",
                builtins: builtinsV3
            })
        )
    })

    it(`throws an error when attempting to parse invalid Bls12_381 G1 zero 1`, () => {
        const src = `(
            program 1.1.0 (
                con bls12_381_G1_element 0x400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
            )
        )`
        throws(() => {
            parseProgram(src, {
                uplcVersion: "1.1.0",
                builtins: builtinsV3
            })
        })
    })
})
