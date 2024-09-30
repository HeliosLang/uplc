import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { UplcInt } from "../../values/index.js"
import { asUplcValue } from "../cast.js"
import { evalQuotientInteger } from "./quotientInteger.js"
import { evalRemainderInteger } from "./remainderInteger.js"

const ctx = { print: () => {} }

/**
 * @type {{a: bigint, b: bigint}[]}
 */
const testVector = [
    { a: 10n, b: -15n },
    { a: -9n, b: 7n },
    { a: 14n, b: 20n },
    { a: -16n, b: -2n },
    { a: 5n, b: -10n },
    { a: -4n, b: 16n },
    { a: -11n, b: -18n },
    { a: 18n, b: -6n },
    { a: 13n, b: 9n },
    { a: -3n, b: 19n },
    { a: 20n, b: -20n },
    { a: 12n, b: 2n },
    { a: -19n, b: -4n },
    { a: 3n, b: 5n },
    { a: -8n, b: 17n },
    { a: 0n, b: -14n },
    { a: 6n, b: 15n },
    { a: -12n, b: 10n },
    { a: -5n, b: 2n },
    { a: 7n, b: -1n },
    { a: 11n, b: -17n },
    { a: -2n, b: 12n },
    { a: -7n, b: 4n },
    { a: 15n, b: -13n },
    { a: 19n, b: 8n },
    { a: -1n, b: -9n },
    { a: 1n, b: -12n },
    { a: -14n, b: 11n },
    { a: 8n, b: -5n },
    { a: 9n, b: 3n },
    { a: -20n, b: 18n },
    { a: 16n, b: -8n },
    { a: 2n, b: 6n },
    { a: -15n, b: 13n },
    { a: 4n, b: 1n },
    { a: 17n, b: -11n },
    { a: -6n, b: 7n },
    { a: 0n, b: -3n },
    { a: -13n, b: 14n },
    { a: 5n, b: -19n },
    { a: 18n, b: -7n },
    { a: -10n, b: 9n },
    { a: -17n, b: 3n },
    { a: 6n, b: 19n },
    { a: 7n, b: -4n },
    { a: -1n, b: 10n },
    { a: 10n, b: 5n },
    { a: -18n, b: -6n },
    { a: 20n, b: -9n }
]

/**
 * @param {bigint} a
 * @param {bigint} b
 * @returns {bigint}
 */
function remainderIntegerWithQuotient(a, b) {
    const ab = asUplcValue(
        evalQuotientInteger(
            [{ value: new UplcInt(a) }, { value: new UplcInt(b) }],
            ctx
        )
    )

    if (ab && ab.kind == "int") {
        return a - ab.value * b
    } else {
        throw new Error("unexpected quotientInteger result type")
    }
}

describe("remainderInteger", () => {
    it("throws an error when second arg is 0", () => {
        throws(() => {
            evalRemainderInteger(
                [{ value: new UplcInt(1n) }, { value: new UplcInt(0n) }],
                ctx
            )
        })
    })

    testVector.forEach(({ a, b }) => {
        const expected = remainderIntegerWithQuotient(a, b)
        it(`${a} quot ${b} == ${expected}`, () => {
            const actual = asUplcValue(
                evalRemainderInteger(
                    [{ value: new UplcInt(a) }, { value: new UplcInt(b) }],
                    ctx
                )
            )

            strictEqual(
                actual && actual.kind == "int" && actual.value == expected,
                true
            )
        })
    })
})
