import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { toBytes } from "@helios-lang/codec-utils"
import { compareByteArrayData } from "./ByteArrayData.js"

describe(`compareByteArrayData`, () => {
    it(`compare(#0101...0101, #0202...0202) == -1`, () => {
        strictEqual(
            compareByteArrayData(
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
