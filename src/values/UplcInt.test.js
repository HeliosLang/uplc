import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { makeFlatReader, makeFlatWriter } from "../flat/index.js"
import { dispatchValueReader } from "./reader.js"
import { decodeUplcIntFromFlat, makeUplcInt } from "./UplcInt.js"
import { makeUplcString } from "./UplcString.js"

const roundtripTestVectorSigned = [-1n, -2n, -3n, -4n]

const roundtripTestVectorUnsigned = [0n, 1n, 2n, 3n, 4n]

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

    roundtripTestVectorSigned.forEach((x) => {
        it(`(${x}).toUnsigned().toSigned() == ${x}`, () => {
            strictEqual(makeUplcInt(x).toUnsigned().toSigned().value, x)
        })
    })

    it(`UplcInt(0).flatSize == 12`, () => {
        strictEqual(makeUplcInt(0n).flatSize, 12)
    })

    it(`unsigned UplcInt(127).flatSize == 12`, () => {
        const i = makeUplcInt(127n, false)
        strictEqual(i.flatSize, 12)
    })

    it(`unsigned UplcInt(128).flatSize == 20`, () => {
        strictEqual(makeUplcInt(128n, false).flatSize, 20)
    })

    it(`unsigned UplcInt(16383).flatSize == 20`, () => {
        strictEqual(makeUplcInt(16383n, false).flatSize, 20)
    })

    it(`unsigned UplcInt(16384).flatSize == 28`, () => {
        strictEqual(makeUplcInt(16384n, false).flatSize, 28)
    })

    it(`unsigned UplcInt(2097151).flatSize == 28`, () => {
        strictEqual(makeUplcInt(2097151n, false).flatSize, 28)
    })

    it(`unsigned UplcInt(2097152).flatSize == 36`, () => {
        strictEqual(makeUplcInt(2097152n, false).flatSize, 36)
    })

    roundtripTestVectorSigned.forEach((x) => {
        it(`decodeUplcIntFromFlat((${x}).toFlat()) == ${x}`, () => {
            const w = makeFlatWriter()

            makeUplcInt(x, true).toFlat(w)

            const r = makeFlatReader({
                bytes: w.finalize(),
                readExpr: (_r) => {
                    throw new Error("deprecated")
                },
                dispatchValueReader
            })

            strictEqual(decodeUplcIntFromFlat(r, true).value, x)
        })
    })

    roundtripTestVectorUnsigned.forEach((x) => {
        it(`decodeUplcIntFromFlat((${x}).toFlatUnsigned()) == ${x}`, () => {
            const w = makeFlatWriter()

            makeUplcInt(x, false).toFlatUnsigned(w)

            const r = makeFlatReader({
                bytes: w.finalize(),
                readExpr: (_r) => {
                    throw new Error("deprecated")
                },
                dispatchValueReader
            })

            strictEqual(decodeUplcIntFromFlat(r, false).value, x)
        })
    })

    it("makeUplcInt throws an error for a non-whole number", () => {
        throws(() => {
            makeUplcInt(0.5)
        })
    })

    it("makeUplcInt throws an error for a string input", () => {
        throws(() => {
            makeUplcInt(/** @type {any} */ ("hello"))
        })
    })

    it(`unsigned UplcInt.toFlat() throws an error`, () => {
        const i = makeUplcInt(0n, false)
        const w = makeFlatWriter()

        throws(() => {
            i.toFlat(w)
        })
    })

    it(`signed UplcInt.toFlatUnsigned() throws an error`, () => {
        const i = makeUplcInt(0n, true)
        const w = makeFlatWriter()

        throws(() => {
            i.toFlatUnsigned(w)
        })
    })

    it(`UplcInt.toString() simply prints value`, () => {
        strictEqual(makeUplcInt(10n).toString(), "10")
    })

    it(`signed UplcInt.toSigned() returns itself`, () => {
        const i = makeUplcInt(10n, true)

        strictEqual(i.toSigned(), i)
    })

    it(`UplcInt isn't equal to a UplcString`, () => {
        strictEqual(makeUplcInt(12n).isEqual(makeUplcString("hello")), false)
    })

    it(`UplcInt isEqual to other UplcInt with same value if both are signed`, () => {
        const a = makeUplcInt(12n)
        const b = makeUplcInt(12n)

        strictEqual(a.isEqual(b), true)
    })

    it(`signed UplcInt isEqual returns false of other value is unsigned`, () => {
        const a = makeUplcInt(12n, true)
        const b = makeUplcInt(12n, false)

        strictEqual(a.isEqual(b), false)
    })

    it(`UplcInt.type is equal to 0`, () => {
        const a = makeUplcInt(0n)

        strictEqual(parseInt(a.type.typeBits, 2), 0)
    })

    it(`UplcInt.memSize is 1 for 0`, () => {
        const a = makeUplcInt(0n)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for 255`, () => {
        const a = makeUplcInt(255n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for -255`, () => {
        const a = makeUplcInt(-255n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for 65535`, () => {
        const a = makeUplcInt(65536n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for -65535`, () => {
        const a = makeUplcInt(-65536n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for 4294967295`, () => {
        const a = makeUplcInt(4294967295n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for -4294967295`, () => {
        const a = makeUplcInt(-4294967295n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 1 for 18446744073709551615`, () => {
        const a = makeUplcInt(18446744073709551615n, true)

        strictEqual(a.memSize, 1)
    })

    it(`UplcInt.memSize is 2 for 18446744073709551616`, () => {
        const a = makeUplcInt(18446744073709551616n, true)

        strictEqual(a.memSize, 2)
    })
})
