import { describe, it } from "node:test"
import { makeBitWriter } from "@helios-lang/codec-utils"
import { encodeFlatInt } from "./int.js"
import { strictEqual } from "node:assert"

describe(encodeFlatInt.name, () => {
    it("writes 8 bits for 0", () => {
        const bw = makeBitWriter()

        encodeFlatInt(bw, 0n)

        strictEqual(bw.length, 8)
    })

    it("writes 8 bits for 127", () => {
        const bw = makeBitWriter()

        encodeFlatInt(bw, 127n)

        strictEqual(bw.length, 8)
    })

    it("writes 16 bits for 128", () => {
        const bw = makeBitWriter()

        encodeFlatInt(bw, 128n)

        strictEqual(bw.length, 16)
    })
})
