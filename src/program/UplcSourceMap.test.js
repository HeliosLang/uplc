import { deepEqual } from "node:assert"
import { describe, it } from "node:test"
import { makeTokenSite } from "@helios-lang/compiler-utils"
import { traverse } from "../terms/index.js"
import { parseUplcProgramV1 } from "./UplcProgramV1.js"
import { deserializeUplcSourceMap, makeUplcSourceMap } from "./UplcSourceMap.js"

describe("UplcSourceMap", () => {
    it("roundtrip", () => {
        const src =
            "(program 1.0.0 [(lam i0 [[(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam i [[[(force (delay (lam b (lam x (lam y [[[[(force (builtin ifThenElse)) b] x] y] (con unit ())]))))) [[(builtin lessThanEqualsInteger) i] (con integer 1)]] (lam u i)] (lam u [[(builtin addInteger) [rec [[(builtin subtractInteger) i] (con integer 1)]]] [rec [[(builtin subtractInteger) i] (con integer 2)]]])]))] i0]) (con integer 0)])"

        const program = parseUplcProgramV1(src)

        traverse(program.root, {
            anyTerm: (term, i) => {
                term.site = makeTokenSite({
                    file: "main",
                    startLine: i,
                    startColumn: i
                })
            }
        })

        const srcMap = makeUplcSourceMap({ term: program.root })

        const programCpy = parseUplcProgramV1(src)

        deserializeUplcSourceMap(srcMap.toJsonSafe()).apply(programCpy.root)

        const srcMapCpy = makeUplcSourceMap({ term: programCpy.root })

        deepEqual(srcMap.toJsonSafe(), srcMapCpy.toJsonSafe())
    })
})
