import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { makeUplcInt } from "../../values/index.js"
import { asCekValue, asUplcValue } from "../cast.js"
import { evalDivideInteger } from "./divideInteger.js"

const ctx = {
    print: () => {}
}

/**
 * @type {{a: bigint, b: bigint, c: bigint}[]}
 */
const testVector = [
    {
        a: 1n,
        b: 1n,
        c: 1n
    },
    {
        a: 0n,
        b: 1n,
        c: 0n
    },
    {
        a: -1n,
        b: 1n,
        c: -1n
    },
    {
        a: -1n,
        b: 2n,
        c: -1n
    },
    {
        a: 1n,
        b: 2n,
        c: 0n
    },
    {
        a: -2n,
        b: 2n,
        c: -1n
    },
    {
        a: -19n,
        b: 10n,
        c: -2n
    }
]

describe("divideInteger", () => {
    it("throws an error when dividing by 0", () => {
        throws(() => {
            evalDivideInteger(
                [asCekValue(makeUplcInt(1)), asCekValue(makeUplcInt(0))],
                ctx
            )
        })
    })

    testVector.forEach(({ a, b, c }) => {
        it(`${a}/${b} == ${c}`, () => {
            const res = asUplcValue(
                evalDivideInteger(
                    [asCekValue(makeUplcInt(a)), asCekValue(makeUplcInt(b))],
                    ctx
                )
            )

            strictEqual(res && res.kind == "int" && res.value == c, true)
        })
    })
})
