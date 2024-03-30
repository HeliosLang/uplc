import { describe, it } from "node:test"
import { decodeBytes } from "@helios-lang/cbor"
import { UplcReader } from "./UplcReader.js"
import { deepEqual } from "node:assert"

const raw = "47460b1621480581"
describe(UplcReader.name, () => {
    it("deserializes #47460b1621480581 into version 11.22.33", () => {
        const r = new UplcReader(decodeBytes(decodeBytes(raw)))

        deepEqual(
            [r.readInt(), r.readInt(), r.readInt(), r.readExpr().toString()],
            [11n, 22n, 33n, "(con integer 11)"]
        )
    })
})
