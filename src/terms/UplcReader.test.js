import { deepEqual } from "node:assert"
import { describe, it } from "node:test"
import { decodeBytes } from "@helios-lang/cbor"
import { makeUplcReader } from "./UplcReader.js"

const raw = "47460b1621480581"
describe("UplcReader", () => {
    it("deserializes #47460b1621480581 into version 11.22.33", () => {
        const r = makeUplcReader({
            bytes: decodeBytes(decodeBytes(raw)),
            builtins: []
        })

        deepEqual(
            [r.readInt(), r.readInt(), r.readInt(), r.readExpr().toString()],
            [11n, 22n, 33n, "(con integer 11)"]
        )
    })
})
