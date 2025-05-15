import { deepEqual, strictEqual, throws } from "node:assert"
import { join } from "node:path"
import { expectLeft, expectRight } from "@helios-lang/type-utils"
import { CONWAY_COST_MODEL_PARAMS_V2 } from "../../../src/costmodel/CostModelParamsV2.js"
import { CONWAY_COST_MODEL_PARAMS_V3 } from "../../../src/costmodel/CostModelParamsV3.js"
import {
    loopTests,
    parseBudget,
    parseUplcProgram
} from "../conformance-utils.js"
import { bytesToHex, equalsBytes } from "@helios-lang/codec-utils"
import { makeFlatWriter } from "../../../src/flat/index.js"
import {
    decodeUplcProgramV2FromCbor,
    decodeUplcProgramV3FromCbor
} from "../../../src/program/index.js"
import { traverse } from "../../../src/terms/ops.js"
import { encodeTerm } from "../../../src/terms/codec.js"

/**
 * @import { UplcProgramV2, UplcProgramV3 } from "../../../src/index.js"
 */

const root = join(import.meta.dirname, "uplc", "evaluation")

// TODO: wrap this in describe
await loopTests(root, async (testPath, uplcStr, budgetStr, resultStr) => {
    console.log(testPath)

    const parseUplc = () => {
        return parseUplcProgram(uplcStr, {
            allowUnresolvedNames: true,
            programName: testPath
        })
    }

    // TODO: wrap this in `it` or `test`
    if (resultStr == budgetStr) {
        // an error is expected
        switch (resultStr) {
            case "parse error":
                throws(parseUplc)
                break
            case "evaluation failure":
                const program = parseUplc()

                // ignore other versions
                if (
                    program.plutusVersion == "PlutusScriptV2" ||
                    program.plutusVersion == "PlutusScriptV3"
                ) {
                    testCodecRoundTrip(program)

                    throws(() => {
                        const { result } = program.eval(undefined, {
                            costModelParams:
                                program.plutusVersion == "PlutusScriptV2"
                                    ? CONWAY_COST_MODEL_PARAMS_V2
                                    : CONWAY_COST_MODEL_PARAMS_V3
                        })

                        const { error } = expectLeft(result)

                        throw new Error(error)
                    })
                }
                break
            default:
                throw new Error(`unhandled golden uplc failure ${resultStr}`)
        }
    } else {
        const program = parseUplc()

        const budget = parseBudget(budgetStr)
        const expectedProgram = parseUplcProgram(resultStr, {
            allowUnresolvedNames: true,
            programName: `${testPath}.expected`
        })

        if (
            program.plutusVersion == "PlutusScriptV2" ||
            program.plutusVersion == "PlutusScriptV3"
        ) {
            testCodecRoundTrip(program)

            const { result, cost } = program.eval(undefined, {
                costModelParams:
                    program.plutusVersion == "PlutusScriptV2"
                        ? CONWAY_COST_MODEL_PARAMS_V2
                        : CONWAY_COST_MODEL_PARAMS_V3
            })

            const { result: expected } = expectedProgram.eval(undefined, {
                costModelParams:
                    expectedProgram.plutusVersion == "PlutusScriptV2"
                        ? CONWAY_COST_MODEL_PARAMS_V2
                        : CONWAY_COST_MODEL_PARAMS_V3
            })

            const resultRight = expectRight(
                result,
                `expected evaluation ok, but got '${"left" in result ? result.left.error : ""}'`
            )
            const expectedResultRight = expectRight(expected)

            if (
                typeof resultRight == "string" ||
                typeof expectedResultRight == "string"
            ) {
                strictEqual(resultRight, expectedResultRight)
            } else {
                const isEqual = expectedResultRight.isEqual(resultRight)

                if (!isEqual) {
                    throw new Error(
                        `expected ${expectedResultRight.toString()}, got ${resultRight.toString()}`
                    )
                }
            }

            strictEqual(cost.mem, budget.mem)
            strictEqual(cost.cpu, budget.cpu)
        } // ignore other versions for now
    }
})

/**
 * @param {UplcProgramV2 | UplcProgramV3} uplc
 */
function testCodecRoundTrip(uplc) {
    // only if all vars are resolved
    let allResolved = true
    traverse(uplc.root, {
        varTerm: (term) => {
            if (term.index < 0) {
                allResolved = false
            }
        }
    })

    if (allResolved) {
        const w0 = makeFlatWriter()
        uplc.root.toFlat(w0)
        const w1 = makeFlatWriter()
        encodeTerm(uplc.root, w1)

        deepEqual(
            w0.finalize(),
            w1.finalize(),
            "recursive encoding algo differs from stack encoding algo"
        )

        const cborHex = bytesToHex(uplc.toCbor())
        const uplcCheck =
            uplc.plutusVersion == "PlutusScriptV2"
                ? decodeUplcProgramV2FromCbor(cborHex)
                : decodeUplcProgramV3FromCbor(cborHex)
        const cborHexCheck = bytesToHex(uplcCheck.toCbor())

        strictEqual(
            cborHex,
            cborHexCheck,
            "round-trip encoding/decoding/encoding failed"
        )
    }
}
