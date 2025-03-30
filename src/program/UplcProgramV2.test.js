import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { expectLeft, expectRight } from "@helios-lang/type-utils"
import {
    BABBAGE_COST_MODEL_PARAMS_V2,
    CONWAY_COST_MODEL_PARAMS_V2
} from "../costmodel/index.js"
import {
    makeByteArrayData,
    makeIntData,
    makeListData,
    makeMapData
} from "../data/index.js"
import { makeUplcDataValue, makeUplcInt } from "../values/index.js"
import {
    decodeUplcProgramV2FromCbor,
    parseUplcProgramV2
} from "./UplcProgramV2.js"

/**
 * @import { UplcValue } from "../index.js"
 */

const dummyArg = makeUplcInt(0)

describe("UplcProgramV2", () => {
    it("evaluates always_fails as error", () => {
        const { result } = decodeUplcProgramV2FromCbor(
            "581e581c01000033223232222350040071235002353003001498498480048005"
        ).eval([dummyArg, dummyArg, dummyArg])

        strictEqual(expectLeft(result).error, "")
    })

    it("evaluates always_succeeds as non-error", () => {
        const program = decodeUplcProgramV2FromCbor(
            "4e4d01000033222220051200120011"
        )

        const { result } = program.eval([dummyArg, dummyArg, dummyArg])

        strictEqual(typeof expectRight(result), "string")
    })

    it(`evaluates (program 1.0.0 (con bool false)) as UplcBool(false)`, () => {
        const program = parseUplcProgramV2("(program 1.0.0 (con bool False))")

        const { result } = program.eval(undefined)

        strictEqual(expectRight(result).toString(), "false")
    })
})

/**
 * Taken from: https://github.com/IntersectMBO/plutus/tree/master/plutus-conformance/test-cases/uplc/evaluation/
 * @type {{src: string, mem: bigint, cpu: bigint, result: string | UplcValue, model?: string}[]}
 */
const conformanceTests = [
    {
        src: "(program 1.0.0 [(builtin listData) (con (list data) [(I 0), (B #1234), (Map [(I 9, List [B #abcd]), (B #4321, I 1234)])])])",
        mem: 432n,
        cpu: 81952n,
        result: makeUplcDataValue(
            makeListData([
                makeIntData(0),
                makeByteArrayData("1234"),
                makeMapData([
                    [makeIntData(9), makeListData([makeByteArrayData("abcd")])],
                    [makeByteArrayData("4321"), makeIntData(1234)]
                ])
            ])
        ),
        model: "conway"
    }
]

const runtimeErrorTests = [
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #04e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])"
]

describe(`"UplcProgramV2 conformance`, () => {
    conformanceTests.forEach(
        ({ src, mem, cpu, result: expectedResult, model }) => {
            it(src, () => {
                const program = parseUplcProgramV2(src)

                const { result, cost } = program.eval(undefined, {
                    costModelParams: chooseModelParams(model)
                })

                const resultRight = expectRight(result)
                const expectedResultRight = expectedResult

                if (
                    typeof resultRight == "string" ||
                    typeof expectedResultRight == "string"
                ) {
                    if (
                        typeof resultRight == "string" &&
                        typeof expectedResultRight == "string"
                    ) {
                        strictEqual(resultRight, expectedResultRight)
                    } else {
                        throw new Error("incomparable term")
                    }
                } else {
                    const isEqual = expectedResultRight.isEqual(resultRight)

                    if (!isEqual) {
                        throw new Error(
                            `expected ${expectedResultRight.toString()}, got ${resultRight.toString()}`
                        )
                    }
                    strictEqual(isEqual, true)
                }

                strictEqual(mem, cost.mem)
                strictEqual(cpu, cost.cpu)
            })
        }
    )

    runtimeErrorTests.forEach((s) => {
        it(`fails to run ${s}`, () => {
            const program = parseUplcProgramV2(s)

            const { result } = program.eval(undefined)
            throws(() => expectRight(result))
        })
    })
})

/**
 * @param {string | undefined} model
 * @returns {number[]}
 */
function chooseModelParams(model) {
    if (!model || model == "babbage") {
        return BABBAGE_COST_MODEL_PARAMS_V2
    } else if (model == "conway") {
        return CONWAY_COST_MODEL_PARAMS_V2
    } else {
        throw new Error(`model ${model} not handled`)
    }
}
