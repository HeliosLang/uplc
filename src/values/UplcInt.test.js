import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { makeUplcInt } from "./UplcInt.js"

const roundtripTestVector = [-1n, -2n, -3n, -4n]

describe("UplcInt", () => {
    it(`(-1).toUnsigned() == 1`, () => {
        strictEqual(makeUplcInt(-1).toUnsigned().value, 1n)
    })

    it(`(1, false).toSigned() == -1`, () => {
        strictEqual(
            makeUplcInt({ value: 1, signed: false }).toSigned().value,
            -1n
        )
    })

    roundtripTestVector.forEach((x) => {
        it(`(${x}).toUnsigned().toSigned() == ${x}`, () => {
            strictEqual(makeUplcInt(x).toUnsigned().toSigned().value, x)
        })
    })
})
