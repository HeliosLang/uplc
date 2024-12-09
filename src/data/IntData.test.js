import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { calcIntMemSize, log2i } from "./IntData.js"

describe("log2i", () => {
    it("log2i(0n) == 0", () => {
        strictEqual(log2i(0n), 0)
    })

    it("log2i(1n) == 0", () => {
        strictEqual(log2i(1n), Math.floor(Math.log2(1)))
    })

    it("log2i(2n) == 1", () => {
        strictEqual(log2i(2n), Math.floor(Math.log2(2)))
    })

    it("log2i(3n) == 1", () => {
        strictEqual(log2i(3n), Math.floor(Math.log2(3)))
    })

    it("log2i(4n) == 2", () => {
        strictEqual(log2i(4n), Math.floor(Math.log2(4)))
    })

    it("log2i(5n) == 2", () => {
        strictEqual(log2i(5n), Math.floor(Math.log2(5)))
    })

    it("log2i(65535n) == 15", () => {
        strictEqual(log2i(65535n), Math.floor(Math.log2(65535)))
    })

    it("log2i(65536n) == 16", () => {
        strictEqual(log2i(65536n), Math.floor(Math.log2(65536)))
    })

    it("log2i(4294967295n) == 31", () => {
        strictEqual(log2i(4294967295n), Math.floor(Math.log2(4294967295)))
    })

    it("log2i(4294967296n) == 32", () => {
        strictEqual(log2i(4294967296n), Math.floor(Math.log2(4294967296)))
    })

    it("log2i(18446744073709551615n) == 63", () => {
        strictEqual(log2i(18446744073709551615n), 63)
    })

    it("log2i(18446744073709551616n) == 64", () => {
        strictEqual(log2i(18446744073709551616n), 64)
    })

    it("log2i(340282366920938463463374607431768211455n) == 127", () => {
        strictEqual(log2i(340282366920938463463374607431768211455n), 127)
    })

    it("log2i(340282366920938463463374607431768211456n) == 128", () => {
        strictEqual(log2i(340282366920938463463374607431768211456n), 128)
    })

    it("log2i(115792089237316195423570985008687907853269984665640564039457584007913129639935n) == 255", () => {
        strictEqual(
            log2i(
                115792089237316195423570985008687907853269984665640564039457584007913129639935n
            ),
            255
        )
    })

    it("log2i(115792089237316195423570985008687907853269984665640564039457584007913129639936n) == 256", () => {
        strictEqual(
            log2i(
                115792089237316195423570985008687907853269984665640564039457584007913129639936n
            ),
            256
        )
    })
})

describe(calcIntMemSize.name, () => {
    it(`memSize of 0 is 1`, () => {
        strictEqual(calcIntMemSize(0n), 1)
    })

    it(`memSize of 255 is 1`, () => {
        strictEqual(calcIntMemSize(255n), 1)
    })

    it(`memSize of -255 is 1`, () => {
        strictEqual(calcIntMemSize(-255n), 1)
    })

    it(`memSize of 65535 is`, () => {
        strictEqual(calcIntMemSize(65536n), 1)
    })

    it(`memSize of -65536 is 1`, () => {
        strictEqual(calcIntMemSize(-65536n), 1)
    })

    it(`memSize of 4294967295 is 1`, () => {
        strictEqual(calcIntMemSize(4294967295n), 1)
    })

    it(`memSize of -4294967295 is 1`, () => {
        strictEqual(calcIntMemSize(-4294967295n), 1)
    })

    it(`memSize of 18446744073709551615 is 1`, () => {
        strictEqual(calcIntMemSize(18446744073709551615n), 1)
    })

    it(`memSize of 18446744073709551616 is 2`, () => {
        strictEqual(calcIntMemSize(18446744073709551616n), 2)
    })
})
