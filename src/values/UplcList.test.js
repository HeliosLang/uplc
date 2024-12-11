import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { makeUplcList } from "./UplcList.js"
import {
    BOOL_TYPE,
    DATA_PAIR_TYPE,
    DATA_TYPE,
    INT_TYPE,
    makeListType,
    makePairType,
    STRING_TYPE
} from "./UplcType.js"

describe("UplcList.isEqual()", () => {
    it("not equal for two empty lists with different item types", () => {
        const a = makeUplcList(INT_TYPE, [])
        const b = makeUplcList(BOOL_TYPE, [])

        strictEqual(a.isEqual(b), false)
    })

    it("equal for two empty lists with the same item types", () => {
        const a = makeUplcList(INT_TYPE, [])
        const b = makeUplcList(INT_TYPE, [])

        strictEqual(a.isEqual(b), true)
    })
})

describe("UplcList.toString()", () => {
    it("not equal for two empty lists with different item types", () => {
        const a = makeUplcList(INT_TYPE, [])
        const b = makeUplcList(BOOL_TYPE, [])

        strictEqual(a.toString() == b.toString(), false)
    })

    it("equal for two empty lists with the same item types", () => {
        const a = makeUplcList(INT_TYPE, [])
        const b = makeUplcList(INT_TYPE, [])

        strictEqual(a.toString(), b.toString())
    })

    it("returns []integer for empty Int list", () => {
        const a = makeUplcList(INT_TYPE, [])

        strictEqual(a.toString(), "[]integer")
    })

    it("returns []bool for empty Bool list", () => {
        const a = makeUplcList(BOOL_TYPE, [])

        strictEqual(a.toString(), "[]bool")
    })

    it("returns []string for empty String list", () => {
        const a = makeUplcList(STRING_TYPE, [])

        strictEqual(a.toString(), "[]string")
    })

    it("returns [](pair data data) for empty Data pair list", () => {
        const a = makeUplcList(DATA_PAIR_TYPE, [])

        strictEqual(a.toString(), "[](pair data data)")
    })

    it("returns [](pair data (pair data data)) for empty Data pair list", () => {
        const a = makeUplcList(makePairType(DATA_TYPE, DATA_PAIR_TYPE), [])

        strictEqual(a.toString(), "[](pair data (pair data data))")
    })

    it("returns [](list (pair data data)) for empty Data pair list", () => {
        const a = makeUplcList(makeListType(DATA_PAIR_TYPE), [])

        strictEqual(a.toString(), "[](list (pair data data))")
    })
})
