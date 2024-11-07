import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { makeDummySite } from "@helios-lang/compiler-utils"
import { makeUplcInt } from "../values/index.js"
import { isEmptyCallSiteInfo, isNonEmptyCallSiteInfo } from "./CallSiteInfo.js"

describe(isEmptyCallSiteInfo.name, () => {
    it("returns true if undefined", () => {
        strictEqual(isEmptyCallSiteInfo(undefined), true)
    })

    it("retruns true if an empty object", () => {
        strictEqual(isEmptyCallSiteInfo({}), true)
    })

    it("returns true if function name is an empty string", () => {
        strictEqual(isEmptyCallSiteInfo({ functionName: "" }), true)
    })

    it("returns false if function name is a non-empty string", () => {
        strictEqual(isEmptyCallSiteInfo({ functionName: "fn" }), false)
    })

    it("returns false if arguments is an empty list", () => {
        strictEqual(isEmptyCallSiteInfo({ arguments: [] }), false)
    })

    it("returns false if arguments is a non-empty list", () => {
        strictEqual(
            isEmptyCallSiteInfo({ arguments: [{ value: makeUplcInt(0) }] }),
            false
        )
    })

    it("returns false if site is defined", () => {
        strictEqual(isEmptyCallSiteInfo({ site: makeDummySite() }), false)
    })
})

describe(isNonEmptyCallSiteInfo.name, () => {
    it("returns false if undefined", () => {
        strictEqual(isNonEmptyCallSiteInfo(undefined), false)
    })

    it("retruns false if an empty object", () => {
        strictEqual(isNonEmptyCallSiteInfo({}), false)
    })

    it("returns false if function name is an empty string", () => {
        strictEqual(isNonEmptyCallSiteInfo({ functionName: "" }), false)
    })

    it("returns true if function name is a non-empty string", () => {
        strictEqual(isNonEmptyCallSiteInfo({ functionName: "fn" }), true)
    })

    it("returns true if arguments is a non-empty list", () => {
        strictEqual(
            isNonEmptyCallSiteInfo({ arguments: [{ value: makeUplcInt(0) }] }),
            true
        )
    })

    it("returns true if arguments is an empty list", () => {
        strictEqual(isNonEmptyCallSiteInfo({ arguments: [] }), true)
    })

    it("returns true if site is defined", () => {
        strictEqual(isNonEmptyCallSiteInfo({ site: makeDummySite() }), true)
    })
})
