import { describe, it } from "node:test"
import { ByteArrayData } from "./ByteArrayData.js"
import { strictEqual } from "node:assert"
import { toBytes } from "@helios-lang/codec-utils"

describe(`${ByteArrayData.name}.compare`, () => {
    it(`compare(#0101...0101, #0202...0202) == -1`, () => {
        strictEqual(
            ByteArrayData.compare(
                toBytes(
                    "0101010101010101010101010101010101010101010101010101010101010101"
                ),
                toBytes(
                    "0202020202020202020202020202020202020202020202020202020202020202"
                )
            ),
            -1
        )
    })
})
