import { strictEqual, throws } from "node:assert"
import { join } from "node:path"
import { CONWAY_COST_MODEL_PARAMS_V2 } from "../../../src/costmodel/CostModelParamsV2.js"
import {
    loopTests,
    parseBudget,
    parseUplcProgram
} from "../conformance-utils.js"
import { expectRight } from "@helios-lang/type-utils"
import { expectLeft } from "@helios-lang/type-utils"

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

                if (program.plutusVersion == "PlutusScriptV2") {
                    // ignore other versions

                    throws(() => {
                        const { result } = program.eval(undefined, {
                            costModelParams: CONWAY_COST_MODEL_PARAMS_V2
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

        if (program.plutusVersion == "PlutusScriptV2") {
            if (expectedProgram.plutusVersion != "PlutusScriptV2") {
                throw new Error(
                    "expected result version not the same as the golden program version"
                )
            }

            const { result, cost } = program.eval(undefined, {
                costModelParams: CONWAY_COST_MODEL_PARAMS_V2
            })

            const { result: expected } = expectedProgram.eval(undefined)

            const resultRight = expectRight(result)
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
