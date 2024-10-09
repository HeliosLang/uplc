import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { UplcInt } from "./UplcInt.js"

const roundtripTestVector = [-1n, -2n, -3n, -4n]

describe(UplcInt.name, () => {
    it(`(-1).toUnsigned() == 1`, () => {
        strictEqual(new UplcInt(-1).toUnsigned().value, 1n)
    })

    it(`(1, false).toSigned() == -1`, () => {
        strictEqual(new UplcInt(1, false).toSigned().value, -1n)
    })

    roundtripTestVector.forEach((x) => {
        it(`(${x}).toUnsigned().toSigned() == ${x}`, () => {
            strictEqual(new UplcInt(x).toUnsigned().toSigned().value, x)
        })
    })
})
