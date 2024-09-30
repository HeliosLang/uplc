import { describe, it } from "node:test"
import { UplcSourceMap, traverseTerms } from "./UplcSourceMap.js"
import { UplcProgramV1 } from "./UplcProgramV1.js"
import { TokenSite } from "@helios-lang/compiler-utils"
import { deepEqual } from "node:assert"

describe(UplcSourceMap.name, () => {
    it("roundtrip", () => {
        const src =
            "(program 1.0.0 [(lam i0 [[(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam i [[[(force (delay (lam b (lam x (lam y [[[[(force (builtin ifThenElse)) b] x] y] (con unit ())]))))) [[(builtin lessThanEqualsInteger) i] (con integer 1)]] (lam u i)] (lam u [[(builtin addInteger) [rec [[(builtin subtractInteger) i] (con integer 1)]]] [rec [[(builtin subtractInteger) i] (con integer 2)]]])]))] i0]) (con integer 0)])"

        const program = UplcProgramV1.fromString(src)

        let i = 0
        traverseTerms(program.root, (term) => {
            term.site = new TokenSite("main", i, i)

            i++
        })

        const srcMap = UplcSourceMap.fromUplcTerm(program.root)

        const programCpy = UplcProgramV1.fromString(src)

        UplcSourceMap.fromJson(srcMap.toJsonSafe()).apply(programCpy.root)

        const srcMapCpy = UplcSourceMap.fromUplcTerm(programCpy.root)

        deepEqual(srcMap.toJsonSafe(), srcMapCpy.toJsonSafe())
    })
})
