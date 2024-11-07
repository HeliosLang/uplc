import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { hexToBytes } from "@helios-lang/codec-utils"
import { expectLeft, expectRight } from "@helios-lang/type-utils"
import { BABBAGE_COST_MODEL_PARAMS_V1 } from "../costmodel/index.js"
import {
    makeByteArrayData,
    makeConstrData,
    makeIntData,
    makeListData,
    makeMapData
} from "../data/index.js"
import {
    makeUplcBuiltin,
    makeUplcCall,
    makeUplcConst,
    makeUplcLambda,
    makeUplcVar
} from "../terms/index.js"
import {
    DATA_PAIR_TYPE,
    DATA_TYPE,
    INT_TYPE,
    UNIT_VALUE,
    makeUplcBool,
    makeUplcByteArray,
    makeUplcDataValue,
    makeUplcInt,
    makeUplcList,
    makeUplcPair,
    makeUplcString
} from "../values/index.js"
import {
    decodeUplcProgramV1FromCbor,
    makeUplcProgramV1,
    parseUplcProgramV1
} from "./UplcProgramV1.js"

/**
 * @import { UplcValue } from "src/index.js"
 */

const dummyArg = makeUplcInt(0)

describe("UplcProgramV1", () => {
    it("evaluates always_fails as error", () => {
        const { result } = decodeUplcProgramV1FromCbor(
            "581e581c01000033223232222350040071235002353003001498498480048005"
        ).eval([dummyArg, dummyArg, dummyArg])

        strictEqual(expectLeft(result).error, "")
    })

    it("evaluates always_succeeds as non-error", () => {
        const program = decodeUplcProgramV1FromCbor(
            "4e4d01000033222220051200120011"
        )

        const { result } = program.eval([dummyArg, dummyArg, dummyArg])

        strictEqual(typeof expectRight(result), "string")
    })

    it("correct cost for add1 program", () => {
        const term = makeUplcCall({
            fn: makeUplcLambda({
                body: makeUplcCall({
                    fn: makeUplcBuiltin({ id: 0, name: "addInteger" }),
                    args: [
                        makeUplcCall({
                            fn: makeUplcVar({ index: 1 }),
                            args: [
                                makeUplcConst({ value: makeUplcInt(12) }),
                                makeUplcConst({ value: makeUplcInt(32) })
                            ]
                        }),
                        makeUplcCall({
                            fn: makeUplcVar({ index: 1 }),
                            args: [
                                makeUplcConst({ value: makeUplcInt(5) }),
                                makeUplcConst({ value: makeUplcInt(4) })
                            ]
                        })
                    ]
                })
            }),
            arg: makeUplcLambda({
                body: makeUplcLambda({
                    body: makeUplcCall({
                        fn: makeUplcBuiltin({ id: 0, name: "addInteger" }),
                        args: [
                            makeUplcCall({
                                fn: makeUplcBuiltin({
                                    id: 0,
                                    name: "addInteger"
                                }),
                                args: [
                                    makeUplcVar({ index: 2 }),
                                    makeUplcVar({ index: 1 })
                                ]
                            }),
                            makeUplcConst({ value: makeUplcInt(1) })
                        ]
                    })
                })
            })
        })

        const program = makeUplcProgramV1({ root: term })

        const { result, cost } = program.eval(undefined, {
            costModelParams: BABBAGE_COST_MODEL_PARAMS_V1
        })

        strictEqual(expectRight(result).toString(), "55")
        deepEqual(cost, { mem: 3710n, cpu: 1860485n })
    })

    it(`evaluates (program 1.0.0 (con bool false)) as UplcBool(false)`, () => {
        const program = parseUplcProgramV1("(program 1.0.0 (con bool False))")

        const { result } = program.eval(undefined)

        strictEqual(expectRight(result).toString(), "false")
    })
})

/**
 * Taken from: https://github.com/IntersectMBO/plutus/tree/master/plutus-conformance/test-cases/uplc/evaluation/
 * @type {{src: string, mem: bigint, cpu: bigint, result: string | UplcValue}[]}
 */
const conformanceTests = [
    {
        src: "(program 1.0.0 (con bool False))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 (con bool True))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 (con bytestring #00ff))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcByteArray([0x00, 0xff])
    },
    {
        src: "(program 1.0.0 (con bytestring #54686543616B654973414C6965))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcByteArray(hexToBytes("54686543616B654973414C6965"))
    },
    {
        src: "(program 1.0.0 (con bytestring #))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcByteArray([])
    },
    {
        src: "(program 1.0.0 (con data (B #0123456789ABCDEF)))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcDataValue(makeByteArrayData("0123456789ABCDEF"))
    },
    {
        src: "(program 1.0.0 (con data (Constr 1 [I 1])))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcDataValue(
            makeConstrData({ tag: 1, fields: [makeIntData(1)] })
        )
    },
    {
        src: "(program 1.0.0 (con data (I 12354898)))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcDataValue(makeIntData(12354898n))
    },
    {
        src: "(program 1.0.0 (con data (List [Constr 1 [], I 1234, B #ABCDEF])))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcDataValue(
            makeListData([
                makeConstrData({ tag: 1, fields: [] }),
                makeIntData(1234),
                makeByteArrayData("ABCDEF")
            ])
        )
    },
    {
        src: "(program 1.0.0 (con data (Map [(B #0123, I 12345), (I 789453, B #456789), (List [I -12364689486], Constr 7 [])])))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcDataValue(
            makeMapData([
                [makeByteArrayData("0123"), makeIntData(12345)],
                [
                    makeIntData(789453),
                    makeByteArrayData({ bytes: hexToBytes("456789") })
                ],
                [
                    makeListData([makeIntData(-12364689486)]),
                    makeConstrData({ tag: 7, fields: [] })
                ]
            ])
        )
    },
    {
        src: "(program 1.0.0 (con integer 0))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 (con integer 1))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 (con integer -1))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(-1)
    },
    {
        src: "(program 1.0.0 (con integer 000000000000000000000000000000000000012345))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(12345)
    },
    {
        src: "(program 1.0.0 (con integer -000000000000000000000000000000000000012345))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(-12345)
    },
    {
        src: "(program 1.0.0 (con integer 7934472584735297345829374203940389857324250374130461237461374324689198237413246172439813568362847918324132461234689173469172364972574327894626348923469234728574196241238723984567805163407561370166661807515263473485635726))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(
            7934472584735297345829374203940389857324250374130461237461374324689198237413246172439813568362847918324132461234689173469172364972574327894626348923469234728574196241238723984567805163407561370166661807515263473485635726n
        )
    },
    {
        src: "(program 1.0.0 (con integer -7934472584735297345829374203940389857324250374130461237461374324689198237413246172439813568362847918324132461234689173469172364972574327894626348923469234728574196241238723984567805163407561370166661807515263473485635726))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcInt(
            -7934472584735297345829374203940389857324250374130461237461374324689198237413246172439813568362847918324132461234689173469172364972574327894626348923469234728574196241238723984567805163407561370166661807515263473485635726n
        )
    },
    {
        src: "(program 1.0.0 (con (list integer) []))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcList({ itemType: INT_TYPE, items: [] })
    },
    {
        src: "(program 1.0.0 (con (pair integer bool) (12345, True)))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcPair({
            first: makeUplcInt(12345),
            second: makeUplcBool(true)
        })
    },
    {
        src: "(program 1.0.0 (con (pair integer (pair unit bool)) (12345, ((), True))))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcPair({
            first: makeUplcInt(12345),
            second: makeUplcPair({
                first: UNIT_VALUE,
                second: makeUplcBool(true)
            })
        })
    },
    {
        src: '(program 1.0.0 (con string ""))',
        mem: 200n,
        cpu: 23100n,
        result: makeUplcString("")
    },
    {
        src: '(program 1.0.0 (con string "xyz"))',
        mem: 200n,
        cpu: 23100n,
        result: makeUplcString("xyz")
    },
    {
        src: '(program 1.0.0 (con string "λ-calculus"))',
        mem: 200n,
        cpu: 23100n,
        result: makeUplcString("λ-calculus")
    },
    {
        src: "(program 1.0.0 (con unit ()))",
        mem: 200n,
        cpu: 23100n,
        result: UNIT_VALUE
    },
    {
        src: "(program 1.0.0 (builtin ifThenElse))",
        mem: 200n,
        cpu: 23100n,
        result: "ifThenElse"
    },
    {
        src: "(program 1.0.0 [[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11) ] (con integer 22)]] [(builtin multiplyInteger) (con integer 11)]] [(builtin subtractInteger) (con integer 22)]])",
        mem: 1702n,
        cpu: 654053n,
        result: "multiplyInteger"
    },
    {
        src: "(program 1.0.0 [[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]] (builtin multiplyInteger)] (builtin subtractInteger)])",
        mem: 1302n,
        cpu: 562053n,
        result: "multiplyInteger"
    },
    {
        src: "(program 1.0.0 [[[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]] [(builtin multiplyInteger) (con integer 11)]] [(builtin subtractInteger) (con integer 22)]] (con integer 22)])",
        mem: 1904n,
        cpu: 792949n,
        result: makeUplcInt(242)
    },
    {
        src: "(program 1.0.0 [(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]])",
        mem: 901n,
        cpu: 389497n,
        result: "ifThenElse"
    },
    {
        src: "(program 1.0.0 (force (builtin ifThenElse)))",
        mem: 300n,
        cpu: 46100n,
        result: "ifThenElse"
    },
    {
        src: '(program 1.0.0 [[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]] (con integer 33)] (con string "abc")])',
        mem: 1302n,
        cpu: 562053n,
        result: makeUplcInt(33)
    },
    {
        src: '(program 1.0.0 [[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]] (con string "11 <= 22")] (con integer -1111)])',
        mem: 1302n,
        cpu: 562053n,
        result: makeUplcString("11 <= 22")
    },
    {
        src: '(program 1.0.0 [[[(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]] (con string "11 <= 22")] (con string "\\\\172(11 <= 22)")])',
        mem: 1302n,
        cpu: 562053n,
        result: makeUplcString("11 <= 22")
    },
    {
        src: '(program 1.0.0 [[(force (builtin ifThenElse)) (con string "11 <= 22")] (con string "\\\\172(11 <= 22)")])',
        mem: 700n,
        cpu: 138100n,
        result: "ifThenElse"
    },
    {
        src: "(program 1.0.0 [(builtin addInteger) (con integer 1) (con integer 2)])",
        mem: 602n,
        cpu: 321577n,
        result: makeUplcInt(3)
    },
    {
        src: "(program 1.0.0 [[(builtin addInteger) (con integer 1)] (con integer 1)])",
        mem: 602n,
        cpu: 321577n,
        result: makeUplcInt(2)
    },
    {
        src: "(program 1.0.0 [[(builtin addInteger) (con integer -1789345783478975892347952789342)] (con integer 5734)])",
        mem: 603n,
        cpu: 322389n,
        result: makeUplcInt(-1789345783478975892347952783608n)
    },
    {
        src: "(program 1.0.0 [[(builtin addInteger) (con integer -1789345783478975892347952789342)] (con integer 57347348957247358792345278346357234234527384258346526378567285925786235963258)])",
        mem: 605n,
        cpu: 324013n,
        result: makeUplcInt(
            57347348957247358792345278346357234234527384256557180595088310033438283173916n
        )
    },
    {
        src: "(program 1.0.0 [[(builtin addInteger) (con integer 0)] (con integer 7527934965792342535732746236582734865623578)])",
        mem: 604n,
        cpu: 323201n,
        result: makeUplcInt(7527934965792342535732746236582734865623578n)
    },
    {
        src: "(program 1.0.0 [[(builtin appendByteString) (con bytestring #00AABBCC)] (con bytestring #FF0033)])",
        mem: 602n,
        cpu: 117242n,
        result: makeUplcByteArray("00aabbccff0033")
    },
    {
        src: "(program 1.0.0 [[(builtin appendByteString) (con bytestring #00AABBCC)] (con bytestring #)])",
        mem: 602n,
        cpu: 117242n,
        result: makeUplcByteArray("00aabbcc")
    },
    {
        src: "(program 1.0.0 [[(builtin appendByteString) (con bytestring #)] (con bytestring #FF0033)])",
        mem: 602n,
        cpu: 117242n,
        result: makeUplcByteArray("ff0033")
    },
    {
        src: '(program 1.0.0 [[(builtin appendString) (con string "Ola")] (con string " mundo!")])',
        mem: 614n,
        cpu: 357870n,
        result: makeUplcString("Ola mundo!")
    },
    {
        src: "(program 1.0.0 [(builtin bData) (con bytestring #0AFD)])",
        mem: 432n,
        cpu: 70100n,
        result: makeUplcDataValue(makeByteArrayData("0afd"))
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [(builtin blake2b_256) (con bytestring #)]] (con bytestring #0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8)])",
        mem: 805n,
        cpu: 505962n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [(builtin blake2b_256) (con bytestring #2e7ea84da4bc4d7cfb463e3f2c8647057afff3fbececa1d200)]] (con bytestring #91c60f99b33303c02b39ed93b713e3915a180c3747f3b31e05727618ee401624)])",
        mem: 805n,
        cpu: 537387n,
        result: makeUplcBool(true)
    },
    {
        src: '(program 1.0.0 [[[[[[(force (builtin chooseData)) (con data (B #001A))] (lam x (con integer 1))] (lam y (con string "two"))] (lam z3 z3)] (lam u (con data (I 4)))] (lam v (con data (B #05)))])',
        mem: 1532n,
        cpu: 341637n,
        result: "(lam v (con data (B #05)))"
    },
    {
        src: '(program 1.0.0 [[[[[[(force (builtin chooseData)) (con data (Constr 1 [I 1]))] (lam x (con integer 1))] (lam y (con string "two"))] (lam z3 z3)] (lam u (con data (I 4)))] (lam v (con data (B #05)))])',
        mem: 1532n,
        cpu: 341637n,
        result: "(lam x (con integer 1))"
    },
    {
        src: '(program 1.0.0 [[[[[[(force (builtin chooseData)) (con data (I 5))] (lam x (con integer 1))] (lam y (con string "two"))] (lam z3 z3)] (lam u (con data (I 4)))] (lam v (con data (B #05)))])',
        mem: 1532n,
        cpu: 341637n,
        result: "(lam u (con data (I 4)))"
    },
    {
        src: '(program 1.0.0 [[[[[[(force (builtin chooseData)) (con data (List [I 0, I 1 ]))] (lam x (con integer 1))] (lam y (con string "two"))] (lam z3 z3)] (lam u (con data (I 4)))] (lam v (con data (B #05)))])',
        mem: 1532n,
        cpu: 341637n,
        result: "(lam z3 z3)"
    },
    {
        src: '(program 1.0.0 [[[[[[(force (builtin chooseData)) (con data (Map [(I 0, B #00), (B #0F, I 1)]))] (lam x (con integer 1))] (lam y (con string "two"))] (lam z3 z3)] (lam u (con data (I 4)))] (lam v (con data (B #05)))])',
        mem: 1532n,
        cpu: 341637n,
        result: '(lam y (con string "two"))'
    },
    {
        src: "(program 1.0.0 [[[(force (force (builtin chooseList))) (con (list integer) [ 0 , 1 , 2 ])] (con integer 1)] (con integer 2)])",
        mem: 1032n,
        cpu: 382454n,
        result: makeUplcInt(2)
    },
    {
        src: "(program 1.0.0 [[[(force (force (builtin chooseList))) (con (list integer) [])] (con integer 1)] (con integer 2)])",
        mem: 1032n,
        cpu: 382454n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [[[(force (force (builtin chooseList))) (con (list integer) [0, 1, 2])] (lam x x)] (lam y (lam z z))])",
        mem: 1032n,
        cpu: 382454n,
        result: "(lam y (lam z z))"
    },
    {
        src: "(program 1.0.0 [[[(force (force (builtin chooseList))) (con (list integer) [])] (lam x x)] (lam y (lam z z))])",
        mem: 1032n,
        cpu: 382454n,
        result: "(lam x x)"
    },
    {
        src: "(program 1.0.0 [[(force (builtin chooseUnit)) (con unit ())] (con integer 2)])",
        mem: 704n,
        cpu: 184517n,
        result: makeUplcInt(2)
    },
    {
        src: "(program 1.0.0 [[(force (builtin chooseUnit)) (con unit ())] (lam x x)])",
        mem: 704n,
        cpu: 184517n,
        result: "(lam x x)"
    },
    {
        src: "(program 1.0.0 [(builtin consByteString) (con integer 84) (con bytestring #686543616B654973414C6965)])",
        mem: 603n,
        cpu: 338095n,
        result: makeUplcByteArray("#54686543616B654973414C6965")
    },
    {
        src: "(program 1.0.0 [(builtin decodeUtf8) (con bytestring #4f6c61)])",
        mem: 406n,
        cpu: 580693n,
        result: makeUplcString("Ola")
    },
    {
        src: "(program 1.0.0 [[(builtin divideInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [(builtin divideInteger) (con integer -503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [(builtin divideInteger) (con integer -503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-1)
    },
    {
        src: "(program 1.0.0 [(builtin divideInteger) (con integer 503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-1)
    },
    {
        src: "(program 1.0.0 [(builtin divideInteger) (con integer 503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(0)
    },
    {
        src: '(program 1.0.0 [(builtin encodeUtf8) (con string "Ola")])',
        mem: 410n,
        cpu: 156086n,
        result: makeUplcByteArray("4f6c61")
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) (con bytestring #00ffaa)] (con bytestring #00ffaa)])",
        mem: 601n,
        cpu: 331935n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lengthOfByteString) (con bytestring #54686543616B654973414C6965)])",
        mem: 410n,
        cpu: 70100n,
        result: makeUplcInt(13)
    },
    {
        src: "(program 1.0.0 [(builtin equalsByteString) (con bytestring #54686543616B654973414C6965) (con bytestring #54686543616B65497341506965)])",
        mem: 601n,
        cpu: 331997n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 324033n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsInteger) (con integer 45723452347050234588234852993485827934)] (con integer 45723452347050234588234852993485827933)])",
        mem: 601n,
        cpu: 324454n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsInteger) (con integer 45723452347050234588234852993485827934)] (con integer 45723452347050234588234852993485827934)])",
        mem: 601n,
        cpu: 324454n,
        result: makeUplcBool(true)
    },
    {
        src: '(program 1.0.0 [[(builtin equalsString) (con string "Ola")] (con string " mundo!")])',
        mem: 601n,
        cpu: 302100n,
        result: makeUplcBool(false)
    },
    {
        src: '(program 1.0.0 [[(builtin equalsString) (con string "Ola")] (con string "Ola")])',
        mem: 601n,
        cpu: 275094n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(force (force (builtin fstPair))) (con (pair bool bytestring) (True, #012345))])",
        mem: 632n,
        cpu: 195536n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(force (builtin headList)) (con (list integer) [1, 2])])",
        mem: 532n,
        cpu: 135349n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [(force (builtin headList)) (con (list integer) [1, 2, 3])])",
        mem: 532n,
        cpu: 135349n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [(builtin iData) (con integer 0)])",
        mem: 432n,
        cpu: 70100n,
        result: makeUplcDataValue(makeIntData(0))
    },
    {
        src: "(program 1.0.0 [[[(force (builtin ifThenElse)) (con bool True)] (lam x x)] (con integer 2)])",
        mem: 901n,
        cpu: 264656n,
        result: "(lam x x)"
    },
    {
        src: "(program 1.0.0 [(force (builtin ifThenElse)) (con bool False) (lam x x) (lam y (lam z z))])",
        mem: 901n,
        cpu: 264656n,
        result: "(lam y (lam z z))"
    },
    {
        src: "(program 1.0.0 [(force (builtin ifThenElse)) (con bool False) (lam x x) (con integer 42)])",
        mem: 901n,
        cpu: 264656n,
        result: makeUplcInt(42)
    },
    {
        src: "(program 1.0.0 [[(builtin indexByteString) (con bytestring #00ffaa)] (con integer 1)])",
        mem: 604n,
        cpu: 172767n,
        result: makeUplcInt(255)
    },
    {
        src: "(program 1.0.0 [(builtin lengthOfByteString) (con bytestring #00ffaa)])",
        mem: 410n,
        cpu: 70100n,
        result: makeUplcInt(3)
    },
    {
        src: "(program 1.0.0 [[(builtin lessThanByteString) (con bytestring #00ff)] (con bytestring #00ffaa)])",
        mem: 601n,
        cpu: 312401n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin equalsByteString) (con bytestring #54686543616B654973414C6965) (con bytestring #54686543616B654973414C6965)])",
        mem: 601n,
        cpu: 331997n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanByteString) (con bytestring #54686543616B654973414C6965) (con bytestring #54686543616B65497341506965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanByteString) (con bytestring #54686543616B65497341506965) (con bytestring #54686543616B654973414C6965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanByteString) (con bytestring #54686543616B65497341506965) (con bytestring #54686543616B654973414C69)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanByteString) (con bytestring #54686543616B654973414C69) (con bytestring #54686543616B65497341506965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin lessThanEqualsByteString) (con bytestring #00ff)] (con bytestring #00)])",
        mem: 601n,
        cpu: 312401n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsByteString) (con bytestring #54686543616B654973414C6964) (con bytestring #54686543616B654973414C6965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsByteString) (con bytestring #54686543616B654973414C6966) (con bytestring #54686543616B654973414C6965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsByteString) (con bytestring #54686543616B654973414C6965) (con bytestring #54686543616B654973414C6965)])",
        mem: 601n,
        cpu: 312557n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin lessThanEqualsInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 320497n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsInteger) (con integer 8) (con integer 4)])",
        mem: 601n,
        cpu: 320497n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsInteger) (con integer 4) (con integer 8)])",
        mem: 601n,
        cpu: 320497n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsInteger) (con integer 4) (con integer 4)])",
        mem: 601n,
        cpu: 320497n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanEqualsInteger) (con integer 3477349701412809834789938452452684373578934257) (con integer 3477349701412809834789938452452684373578934257)])",
        mem: 601n,
        cpu: 321443n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin lessThanInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 324507n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanInteger) (con integer 8) (con integer 4)])",
        mem: 601n,
        cpu: 324507n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanInteger) (con integer 4) (con integer 8)])",
        mem: 601n,
        cpu: 324507n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanInteger) (con integer 4) (con integer 4)])",
        mem: 601n,
        cpu: 324507n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(builtin lessThanInteger) (con integer 3477349701412809834789938452452684373578934257) (con integer 3477349701412809834789938452452684373578934257)])",
        mem: 601n,
        cpu: 325529n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[(force (builtin mkCons)) (con integer 0)] (con (list integer) [])])",
        mem: 732n,
        cpu: 203593n,
        result: makeUplcList({ itemType: INT_TYPE, items: [makeUplcInt(0)] })
    },
    {
        src: "(program 1.0.0 [[(force (builtin mkCons)) (con integer 0)] (con (list integer) [1, 2])])",
        mem: 732n,
        cpu: 203593n,
        result: makeUplcList({
            itemType: INT_TYPE,
            items: [makeUplcInt(0), makeUplcInt(1), makeUplcInt(2)]
        })
    },
    {
        src: "(program 1.0.0 [(builtin mkNilData) (con unit ())])",
        mem: 432n,
        cpu: 91658n,
        result: makeUplcList({ itemType: DATA_TYPE, items: [] })
    },
    {
        src: "(program 1.0.0 [(builtin mkNilPairData) (con unit ())])",
        mem: 432n,
        cpu: 85663n,
        result: makeUplcList({ itemType: DATA_PAIR_TYPE, items: [] })
    },
    {
        src: "(program 1.0.0 [[(builtin modInteger) (con integer 2) ] (con integer 3)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(2)
    },
    {
        src: "(program 1.0.0 [(builtin modInteger) (con integer -503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-503)
    },
    {
        src: "(program 1.0.0 [(builtin modInteger) (con integer -503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(1777777274)
    },
    {
        src: "(program 1.0.0 [(builtin modInteger) (con integer 503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-1777777274)
    },
    {
        src: "(program 1.0.0 [(builtin modInteger) (con integer 503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(503)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer 1)] (con integer 1)])",
        mem: 602n,
        cpu: 207996n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer 793479793478939166266268485555555)] (con integer 0)])",
        mem: 603n,
        cpu: 219683n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer 793479793478939)] (con integer 166266268485555555)])",
        mem: 602n,
        cpu: 207996n,
        result: makeUplcInt(131928924380432445633603606956145n)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer 793479793478939)] (con integer -166266268485555555)])",
        mem: 602n,
        cpu: 207996n,
        result: makeUplcInt(-131928924380432445633603606956145n)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer -793479793478939)] (con integer 166266268485555555)])",
        mem: 602n,
        cpu: 207996n,
        result: makeUplcInt(-131928924380432445633603606956145n)
    },
    {
        src: "(program 1.0.0 [[(builtin multiplyInteger) (con integer -793479793478939) ] (con integer -166266268485555555)])",
        mem: 602n,
        cpu: 207996n,
        result: makeUplcInt(131928924380432445633603606956145n)
    },
    {
        src: "(program 1.0.0 [(force (builtin nullList)) (con (list integer) [1, 2, 3])])",
        mem: 532n,
        cpu: 152191n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(force (builtin nullList)) (con (list integer) [])])",
        mem: 532n,
        cpu: 152191n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 (con (pair (pair bool bytestring) (list integer)) ((True, #012345), [0, 1, 2])))",
        mem: 200n,
        cpu: 23100n,
        result: makeUplcPair({
            first: makeUplcPair({
                first: makeUplcBool(true),
                second: makeUplcByteArray("012345")
            }),
            second: makeUplcList({
                itemType: INT_TYPE,
                items: [makeUplcInt(0), makeUplcInt(1), makeUplcInt(2)]
            })
        })
    },
    {
        src: "(program 1.0.0 [[(builtin quotientInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [(builtin quotientInteger) (con integer -503783783785265728700234277) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568780n,
        result: makeUplcInt(283378378503190012n)
    },
    {
        src: "(program 1.0.0 [(builtin quotientInteger) (con integer -503783783785265728700234277) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568780n,
        result: makeUplcInt(-283378378503190012n)
    },
    {
        src: "(program 1.0.0 [(builtin quotientInteger) (con integer 503783783785265728700234277) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568780n,
        result: makeUplcInt(-283378378503190012n)
    },
    {
        src: "(program 1.0.0 [(builtin quotientInteger) (con integer 503783783785265728700234277) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568780n,
        result: makeUplcInt(283378378503190012n)
    },
    {
        src: "(program 1.0.0 [[(builtin remainderInteger) (con integer 1)] (con integer 2)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [(builtin remainderInteger) (con integer -503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-503)
    },
    {
        src: "(program 1.0.0 [(builtin remainderInteger) (con integer -503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(-503)
    },
    {
        src: "(program 1.0.0 [(builtin remainderInteger) (con integer 503) (con integer -1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(503)
    },
    {
        src: "(program 1.0.0 [(builtin remainderInteger) (con integer 503) (con integer 1777777777)])",
        mem: 601n,
        cpu: 568560n,
        result: makeUplcInt(503)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [ (builtin sha2_256) (con bytestring #)]] (con bytestring #e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)])",
        mem: 805n,
        cpu: 1215593n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [(builtin sha2_256) (con bytestring #2e7ea84da4bc4d7cfb463e3f2c8647057afff3fbececa1d200)]] (con bytestring #76e3acbc718836f2df8ad2d0d2d76f0cfa5fea0986be918f10bcee730df441b9)])",
        mem: 805n,
        cpu: 1307039n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [(builtin sha3_256) (con bytestring #)]] (con bytestring #a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a)])",
        mem: 805n,
        cpu: 2388570n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(builtin equalsByteString) [(builtin sha3_256) (con bytestring #9b3fdf8d448680840d6284f2997d3af55ffd85f6f4b33d7f8d)]] (con bytestring #25005d10e84ff97c74a589013be42fb37f68db64bdfc7626efc0dd628077493a)])",
        mem: 805n,
        cpu: 2636139n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [(builtin sliceByteString) (con integer 3) (con integer 5) (con bytestring #54686543616B654973414C6965)])",
        mem: 804n,
        cpu: 426418n,
        result: makeUplcByteArray("43616b6549")
    },
    {
        src: "(program 1.0.0 [(builtin sliceByteString) (con integer -3) (con integer 5) (con bytestring #54686543616B654973414C6965)])",
        mem: 804n,
        cpu: 426418n,
        result: makeUplcByteArray("5468654361")
    },
    {
        src: "(program 1.0.0 [(builtin sliceByteString) (con integer -3) (con integer 1234) (con bytestring #54686543616B654973414C6965)])",
        mem: 804n,
        cpu: 426418n,
        result: makeUplcByteArray("54686543616b654973414c6965")
    },
    {
        src: "(program 1.0.0 [(builtin sliceByteString) (con integer 5) (con integer 3) (con bytestring #54686543616B654973414C6965)])",
        mem: 804n,
        cpu: 426418n,
        result: makeUplcByteArray("6b6549")
    },
    {
        src: "(program 1.0.0 [(builtin sliceByteString) (con integer 123456789123456789) (con integer 123456789123456789) (con bytestring #54686543616B654973414C6965)])",
        mem: 804n,
        cpu: 426418n,
        result: makeUplcByteArray([])
    },
    {
        src: "(program 1.0.0 [[(builtin subtractInteger) (con integer 1)] (con integer 1)])",
        mem: 602n,
        cpu: 321577n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [[(builtin subtractInteger) (con integer 123423)] (con integer -794378954789297841)])",
        mem: 602n,
        cpu: 321577n,
        result: makeUplcInt(794378954789421264n)
    },
    {
        src: "(program 1.0.0 [[(builtin subtractInteger) (con integer 134782734132417234781342718231486243)] (con integer 23443231)])",
        mem: 603n,
        cpu: 322389n,
        result: makeUplcInt(134782734132417234781342718208043012n)
    },
    {
        src: "(program 1.0.0 [[(builtin subtractInteger) (con integer 0)] (con integer -327893248793249782347891)])",
        mem: 603n,
        cpu: 322389n,
        result: makeUplcInt(327893248793249782347891n)
    },
    {
        src: "(program 1.0.0 [[(builtin subtractInteger) (con integer 1)] (con integer 2)])",
        mem: 602n,
        cpu: 321577n,
        result: makeUplcInt(-1)
    },
    {
        src: '(program 1.0.0 [[(force (builtin trace)) (con string "Ola")] (con integer 2)])',
        mem: 732n,
        cpu: 350442n,
        result: makeUplcInt(2)
    },
    {
        src: "(program 1.0.0 [(lam x x) (con unit ())])",
        mem: 500n,
        cpu: 92100n,
        result: UNIT_VALUE
    },
    {
        src: "(program 1.0.0 [(lam x x) (con integer 0)])",
        mem: 500n,
        cpu: 92100n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [(lam x (con bool False)) (con integer 42)])",
        mem: 500n,
        cpu: 92100n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [(lam x x) (con integer 42)])",
        mem: 500n,
        cpu: 92100n,
        result: makeUplcInt(42)
    },
    {
        src: "(program 1.0.0 [[(lam x x) (lam y y)] (con integer 42)])",
        mem: 800n,
        cpu: 161100n,
        result: makeUplcInt(42)
    },
    {
        src: "(program 1.0.0 [(lam x x) (lam y y)])",
        mem: 500n,
        cpu: 92100n,
        result: "(lam y y)"
    },
    {
        src: "(program 1.0.0 [(lam x (lam y x)) (con integer 42)])",
        mem: 500n,
        cpu: 92100n,
        result: "(lam y x)"
    },
    {
        src: "(program 1.0.0 [(lam x (lam y x)) (con integer 42) (con bool False)])",
        mem: 800n,
        cpu: 161100n,
        result: makeUplcInt(42)
    },
    {
        src: "(program 1.0.0 [(lam f (lam x (lam y [f x y]))) (lam a (lam b a)) (con bool False) (con bool True)])",
        mem: 1700n,
        cpu: 368100n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [ (lam i_0 (lam j_1 i_0)) (con integer 1) ])",
        mem: 500n,
        cpu: 92100n,
        result: "(lam j_1 i_0)"
    },
    {
        src: "(program 1.0.0 [(lam x (con integer 4)) (delay (error))])",
        mem: 500n,
        cpu: 92100n,
        result: makeUplcInt(4)
    },
    {
        src: "(program 1.0.0 [(lam x x) (delay (error))])",
        mem: 500n,
        cpu: 92100n,
        result: "(delay (error))"
    },
    {
        src: "(program 1.0.0 (lam x (delay x)))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam x (delay x))"
    },
    {
        src: "(program 1.0.0 [(lam x (force x)) (delay (con integer 4))])",
        mem: 700n,
        cpu: 138100n,
        result: makeUplcInt(4)
    },
    {
        src: "(program 1.0.0 [(lam x (force [(lam y y) x])) (delay (con integer 4))])",
        mem: 1000n,
        cpu: 207100n,
        result: makeUplcInt(4)
    },
    {
        src: "(program 1.0.0 (lam x x))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam x x)"
    },
    {
        src: "(program 1.0.0 (lam x (con integer 23)))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam x (con integer 23))"
    },
    {
        src: "(program 1.0.0 [(builtin addInteger) (con unit ())])",
        mem: 400n,
        cpu: 69100n,
        result: "addInteger"
    },
    {
        src: "(program 1.0.0 [[(force (force (delay (delay (lam f (lam x [ f x ])))))) [(builtin addInteger) [(lam x0 [[(builtin multiplyInteger) [[(builtin multiplyInteger) x0] x0]] [[(builtin subtractInteger) [[(builtin subtractInteger) (con integer 0)] (con integer 1)]] [[(builtin subtractInteger) (con integer 3)] (con integer 0)]]]) [(lam x1 [[(builtin subtractInteger) [[(builtin multiplyInteger) (con integer 0)] (con integer 2)]] [[(builtin addInteger) (con integer 0)] (con integer 1)]]) [(lam x2 [[(builtin subtractInteger) (con integer 2) ] (con integer 2)])[(builtin sha3_256) (con bytestring #76)]]]]]] [(lam x0 [[(builtin addInteger) [[(builtin addInteger) [[(builtin multiplyInteger) (con integer 2) ] (con integer 1)]] [[(builtin addInteger) (con integer 2)] (con integer 3)]]] [[(builtin subtractInteger) [[(builtin subtractInteger) (con integer 1)] (con integer 2)]] [[(builtin subtractInteger) (con integer 2)] (con integer 1)]]]) [[(builtin lessThanInteger) (con integer 3)] [[(builtin multiplyInteger) [[(builtin addInteger) (con integer 2)] (con integer 1)]] [[(builtin subtractInteger) (con integer 2)] (con integer 0)]]]]])",
        mem: 11045n,
        cpu: 8288591n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [[[(force (force (delay (delay (lam f (lam x [ f x ])))))) (builtin addInteger)] [(lam x0 [[(builtin multiplyInteger) [[(builtin subtractInteger) [[(builtin subtractInteger) (con integer 3)] (con integer 2)]] [[(builtin addInteger) (con integer 2)] (con integer 0)]]] [[(builtin subtractInteger) [[(builtin multiplyInteger) (con integer 3)] (con integer 0)]] [[(builtin multiplyInteger) (con integer 1)] (con integer 1)]]]) [[(builtin lessThanEqualsInteger) [[(builtin subtractInteger) [[(builtin multiplyInteger) (con integer 3)] (con integer 3)]] [[(builtin subtractInteger) (con integer 2)] (con integer 3)]]] [[(builtin addInteger) [[(builtin addInteger) (con integer 2)] (con integer 3)]] [[(builtin subtractInteger) (con integer 3)] (con integer 3)]]]]] [(lam x0 [(lam x2 [[(builtin addInteger) [[(builtin subtractInteger) (con integer 0)] (con integer 3)]] [[(builtin subtractInteger) (con integer 2)] (con integer 1)]]) [[(builtin subtractInteger) [[(builtin addInteger) (con integer 1)] (con integer 1)]] [[(builtin subtractInteger) (con integer 2)] (con integer 0)]]]) [(lam x1 [[(builtin lessThanInteger) [[(builtin multiplyInteger) (con integer 0)] (con integer 3)]] [[(builtin addInteger) (con integer 0)] (con integer 1)]]) [[(builtin equalsInteger) [[(builtin multiplyInteger) (con integer 3)] (con integer 2)]] [[(builtin subtractInteger) (con integer 2)] (con integer 0)]]]]])",
        mem: 13251n,
        cpu: 7910799n,
        result: makeUplcInt(-1)
    },
    {
        src: "(program 1.0.0 (lam n (delay (lam z (lam f [ f [ [ (force n) z ] f ] ])))))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam n (delay (lam z (lam f [f [[(force n) z] f]]))))"
    },
    {
        src: "(program 1.0.0 (delay (lam z (lam f z))))",
        mem: 200n,
        cpu: 23100n,
        result: "(delay (lam z (lam f z)))"
    },
    {
        src: "(program 1.0.0 [[(force [(force (force (force (force (delay (delay (delay (delay (lam f_7 [[(force (delay (lam by_1 [(force (force (delay (delay (lam f_2 [(force (delay (lam s_1 [s_1 s_1]))) (lam s_3 (lam x_4 [[f_2 [(force (delay (lam s_1 [s_1 s_1]))) s_3]] x_4]))]))))) (lam rec_8 (lam h_11 (delay (lam fr_14 [(force [by_1 (delay (lam fq_16 [(force [rec_8 h_11]) [(force h_11) fq_16]]))]) fr_14]))))]))) (lam k_9 (delay (lam h_12 [[h_12 (lam x_15 [(force k_9) (lam f_0_13 (lam f_1_14 [f_0_13 x_15]))])] (lam x_18 [(force k_9) (lam f_0_16 (lam f_1_17 [f_1_17 x_18]))])])))] f_7]))))))))) (delay (lam choose_5 (lam even_0 (lam odd_1 [[choose_5 (lam n_2 [[(force n_2) (con bool True)] odd_1])] (lam n_3 [[(force n_3) (con bool False)] even_0])]))))]) (lam arg_0_0 (lam arg_1_1 arg_0_0))] [(lam n_0 (delay (lam z_2 (lam f_3 [ f_3 n_0 ])))) [(lam n_0 (delay (lam z_2 (lam f_3 [ f_3 n_0 ])))) (delay (lam z_1 (lam f_2 z_1)))]]])",
        mem: 27300n,
        cpu: 6256100n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[(force [(force (force (force (force (delay (delay (delay (delay (lam f_7 [[(force (delay (lam by_1 [(force (force (delay (delay (lam f_2 [(force (delay (lam s_1 [s_1 s_1]))) (lam s_3 (lam x_4 [[f_2 [(force (delay (lam s_1 [s_1 s_1]))) s_3]] x_4]))]))))) (lam rec_8 (lam h_11 (delay (lam fr_14 [(force [by_1 (delay (lam fq_16 [(force [rec_8 h_11]) [(force h_11) fq_16]]))]) fr_14]))))]))) (lam k_9 (delay (lam h_12 [[h_12 (lam x_15 [(force k_9) (lam f_0_13 (lam f_1_14 [f_0_13 x_15]))])] (lam x_18 [(force k_9) (lam f_0_16 (lam f_1_17 [f_1_17 x_18]))])])))] f_7]))))))))) (delay (lam choose_5 (lam even_0 (lam odd_1 [[choose_5 (lam n_2 [[(force n_2) (con bool True)] odd_1])] (lam n_3 [[(force n_3) (con bool False)] even_0])]))))]) (lam arg_0_0 (lam arg_1_1 arg_0_0))] [(lam n_0 (delay (lam z_2 (lam f_3 [ f_3 n_0 ])))) [(lam n_0 (delay (lam z_2 (lam f_3 [ f_3 n_0 ])))) [(lam n_0 (delay (lam z_2 (lam f_3 [ f_3 n_0 ])))) (delay (lam z_1 (lam f_2 z_1)))]]]])",
        mem: 34200n,
        cpu: 7843100n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[[(force (force (delay (delay (lam f_2 [(force (force (delay (delay (lam f_2 [(force (delay (lam s_1 [s_1 s_1]))) (lam s_3 (lam x_4 [[f_2 [(force (delay (lam s_1 [s_1 s_1]))) s_3]] x_4]))]))))) (lam rec_3 (lam z_4 (lam xs_5 [[(force xs_5) z_4] (lam x_6 (lam xsdash_7 [[rec_3 [[f_2 z_4] x_6]] xsdash_7]))])))]))))) (lam acc_0 (lam n_1 [[(builtin addInteger) acc_0] [[[(force (delay (lam f_1 [(force (force (delay (delay (lam f_2 [(force (delay (lam s_1 [s_1 s_1]))) (lam s_3 (lam x_4 [[f_2 [(force (delay (lam s_1 [s_1 s_1]))) s_3]] x_4]))]))))) (lam rec_2 (lam z_3 (lam n_4 [[(force n_4) z_3] (lam ndash_5 [[rec_2 [f_1 z_3]] ndash_5])])))]))) [(builtin addInteger) (con integer 1)]] (con integer 0)] n_1]]))] (con integer 0)] [[(force [(force (force (force (force (delay (delay (delay (delay (lam f_7 [[(force (delay (lam by_1 [(force (force (delay (delay (lam f_2 [(force (delay (lam s_1 [s_1 s_1]))) (lam s_3 (lam x_4 [[f_2 [(force (delay (lam s_1 [s_1 s_1]))) s_3]] x_4]))]))))) (lam rec_8 (lam h_11 (delay (lam fr_14 [(force [by_1 (delay (lam fq_16 [(force [rec_8 h_11]) [(force h_11) fq_16]]))]) fr_14]))))]))) (lam k_9 (delay (lam h_12 [[h_12 (lam x_15 [(force k_9) (lam f_0_13 (lam f_1_14 [f_0_13 x_15]))])] (lam x_18 [(force k_9) (lam f_0_16 (lam f_1_17 [f_1_17 x_18]))])])))] f_7]))))))))) (delay (lam choose_9 (lam even_0 (lam odd_1 [[choose_9 (lam l_4 [[(force l_4) (force (delay (delay (lam z_2 (lam f_3 z_2)))))] (lam head_2 (lam tail_3 [[(force (delay (lam x_1 (lam xs_2 (delay (lam z_4 (lam f_5 [[f_5 x_1] xs_2]))))))) head_2] [odd_1 tail_3]]))])] (lam l_7 [[(force l_7) (force (delay (delay (lam z_2 (lam f_3 z_2)))))] (lam head_5 (lam tail_6 [even_0 tail_6]))])]))))]) (lam arg_0_0 (lam arg_1_1 arg_0_0))] [[(force (delay (lam x_1 (lam xs_2 (delay (lam z_4 (lam f_5 [[f_5 x_1] xs_2]))))))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) (delay (lam z_1 (lam f_2 z_1)))]] [[(force (delay (lam x_1 (lam xs_2 (delay (lam z_4 (lam f_5 [[f_5 x_1] xs_2]))))))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) (delay (lam z_1 (lam f_2 z_1)))]]] [[(force (delay (lam x_1 (lam xs_2 (delay (lam z_4 (lam f_5 [[f_5 x_1] xs_2]))))))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) [(lam n_0 (delay (lam z_2 (lam f_3 [f_3 n_0])))) (delay (lam z_1 (lam f_2 z_1)))]]]] (force (delay (delay (lam z_2 (lam f_3 z_2)))))]]]]])",
        mem: 78912n,
        cpu: 19362962n,
        result: makeUplcInt(4)
    },
    {
        src: "(program 1.0.0 [(lam i [[[(force (force (delay (delay (lam f [(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam z (lam xs [[(force xs) z] (lam x (lam xsdash [[rec [[f z] x]] xsdash]))])))]))))) (builtin multiplyInteger)] (con integer 1)] [[(lam n (lam m [[(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam ndash [[[(force (delay (lam b (lam x (lam y [[[[(force (builtin ifThenElse)) b] x] y] (con unit ())]))))) [[(builtin lessThanEqualsInteger) ndash] m]] (lam u [[(force (delay (lam x (lam xs (delay (lam z (lam f [[f x] xs]))))))) ndash] [rec [(lam i [[(builtin addInteger) i] (con integer 1)]) ndash]]])] (lam u (force (delay (delay (lam z (lam f z))))))]))] n])) (con integer 1)] i]]) (con integer 4)])",
        mem: 50026n,
        cpu: 14104357n,
        result: makeUplcInt(24)
    },
    {
        src: "(program 1.0.0 [(lam i0 [[(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam i [[[(force (delay (lam b (lam x (lam y [[[[(force (builtin ifThenElse)) b] x] y] (con unit ())]))))) [[(builtin lessThanEqualsInteger) i] (con integer 1)]] (lam u i)] (lam u [[(builtin addInteger) [rec [[(builtin subtractInteger) i] (con integer 1)]]] [rec [[(builtin subtractInteger) i] (con integer 2)]]])]))] i0]) (con integer 0)])",
        mem: 6202n,
        cpu: 1689053n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 (lam x (force x)))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam x (force x))"
    },
    {
        src: "(program 1.0.0 [[[(force (delay (lam b (lam x (lam y [[[[(force (builtin ifThenElse)) b] x] y] (con unit ())]))))) [(lam x0 [[(builtin equalsByteString) [(builtin sha2_256) [(builtin sha3_256) (con bytestring #64)]]] x0]) [[(builtin appendByteString) [(lam x1 [(builtin sha3_256) (con bytestring #78)]) [(builtin sha3_256) (con bytestring #726e)]]] (con bytestring #6973)]]] [(force (force (delay (delay (lam x (lam y x)))))) [(lam x0 [(lam x2 x0) [(builtin sha2_256) [(builtin sha3_256) (con bytestring #)]]]) [[(builtin subtractInteger) [[(builtin addInteger) [[(builtin subtractInteger) (con integer 2)] (con integer 2)]] [[(builtin subtractInteger) (con integer 1)] (con integer 3)]]] [(lam x1 [[(builtin subtractInteger) (con integer 3)] (con integer 3)]) [[(builtin equalsByteString) (con bytestring #6c7a)] (con bytestring #6673)]]]]]] [(force (force (delay (delay (lam x (lam y x)))))) (con integer 0)]])",
        mem: 9642n,
        cpu: 13663363n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 [[[(force (delay (lam f [(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam z (lam n [[(force n) z] (lam ndash [[rec [f z]] ndash])])))]))) [(builtin addInteger) (con integer 1)]] (con integer 0)] [(lam n (delay (lam z (lam f [f n])))) (delay (lam z (lam f z)))]])",
        mem: 8802n,
        cpu: 2207577n,
        result: makeUplcInt(1)
    },
    {
        src: "(program 1.0.0 [[[[[(force (builtin ifThenElse)) [[(builtin lessThanInteger) (con integer 1)] (con integer 3)]] (builtin addInteger)] (builtin subtractInteger)] (con integer 1)] (con integer 3)])",
        mem: 1704n,
        cpu: 864540n,
        result: makeUplcInt(4)
    },
    {
        src: "(program 1.0.0 [[[(force (force (delay (delay (lam f [(force (force (delay (delay (lam f [(force (delay (lam s [s s]))) (lam s (lam x [[f [(force (delay (lam s [s s]))) s]] x]))]))))) (lam rec (lam z (lam xs [[(force xs) z] (lam x (lam xsdash [[rec [[f z] x]] xsdash]))])))]))))) (builtin addInteger)] (con integer 0)] (force (delay (delay (lam z (lam f z)))))])",
        mem: 5400n,
        cpu: 1219100n,
        result: makeUplcInt(0)
    },
    {
        src: "(program 1.0.0 (lam i [ [ (builtin addInteger) i ] (con integer 1) ]))",
        mem: 200n,
        cpu: 23100n,
        result: "(lam i [[(builtin 0) i] (con integer 1)])"
    }
]

const syntaxErrorTests = [
    "(program 1.0.0 (con bytestring #12345))",
    "(program 1.0.0 (con data (B 42)))",
    "(program 1.0.0 (con data (Constr [I 1])))",
    "(program 1.0.0 (con data (I [])))",
    "(program 1.0.0 (con data (List #ABCDEF)))",
    "(program 1.0.0 (con data (List [ (B #0123,   I 12345), (B #456789, I 789453), (B #0ABCDE, I 12364689486)])))",
    "(program 1.0.0 (con integer 0.5))",
    "(program 1.0.0 (con integer #12))",
    "(program 1.0.0 (con (list bool) [5]))",
    "(program 1.0.0 (con (list bool) [(lam x (lam y x))])",
    "(program 1.0.0 (con list(bool) [True, False, True]))",
    "(program 1.0.0 (con list(unit) [(), (), (), (), ()]))",
    "(program 1.0.0 (con (pair integer string) ((lam x x), 1))",
    "(program 1.0.0 (con (pair integer string) (1, (lam y y))))",
    "(program 1.0.0 (con (pair integer (pair bool unit)) (12345, ((),True))))",
    "(program 1.0.0 (con string 144))",
    "(program 1.0.0 [[(builtin constrData) (con integer 1)] (con list(data) [{ Integer 0 }])])",
    "(program 1.0.0 [[(builtin equalsData) (con data {Constr 1 [Integer 0]})] (con data {Constr 1 [Integer 0]})])",
    "(program 1.0.0 [(builtin listData) (con list(data) [{Integer 0}])])",
    "(program 1.0.0 (con list(list(integer)) [[0], [0, 1, 2], [4, 5, 2]]))",
    "(program 1.0.0 (con list(pair (integer) (bool)) [(1, True), (500000, False), (0, True)]))",
    "(program 1.0.0 [(builtin mapData) (con list(pair (data) (data)) [({Integer 0}, {Integer 1})])])",
    "(program 1.0.0 [[(builtin mkPairData) (con data { List [ Integer 0, Integer 1 ] })] (con data { Constr 1 [ Integer 3 ] })])",
    "(program 1.0.0 [(force (builtin sndPair)) (con pair (bool) (bytestring) (True, #012345))])",
    "(program 1.0.0 [(builtin unBData) (con data {ByteString #AF00})])",
    "(program 1.0.0 [(builtin unBData) (con data {Integer 0})])",
    "(program 1.0.0 [(builtin unConstrData) (con data {Constr 1 [Integer 0]})])",
    "(program 1.0.0 [(builtin unConstrData) (con data {ByteString #AF00})])",
    "(program 1.0.0 [(builtin unIData) (con data {Integer 0})])",
    "(program 1.0.0 [(builtin unIData) (con data {ByteString #AF00})])",
    "(program 1.0.0 [(builtin unListData) (con data {List [Integer 0, Integer 1]})])",
    "(program 1.0.0 [(builtin unListData) (con data {ByteString #AF00})])",
    "(program 1.0.0 [(builtin unMapData) (con data {Map [(Integer 0, Integer 1)]})])",
    "(program 1.0.0 [(builtin unMapData) (con data {ByteString #AF00})])",
    "(program 1.0.0 x)"
]

const runtimeErrorTests = [
    "(program 1.0.0 (force [(force (builtin ifThenElse)) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]]))",
    "(program 1.0.0 (force (force (builtin ifThenElse))))",
    '(program 1.0.0 [[[(builtin ifThenElse) [[(builtin lessThanEqualsInteger) (con integer 11) ] (con integer 22)]] (con string "11 <= 22")] (con string "\\\\172(11 <= 22)")])',
    "(program 1.0.0 [(builtin ifThenElse) [[(builtin lessThanEqualsInteger) (con integer 11)] (con integer 22)]])",
    '(program 1.0.0 [[[(force (builtin ifThenElse)) (con string "11 <= 22")] (con string "\\\\172(11 <= 22)")] (con string "\\\\172(11 <= 22)")])',
    "(program 1.0.0 [[(force (builtin multiplyInteger)) (con integer 11)] (con integer 22)])",
    "(program 1.0.0 [(force [(builtin multiplyInteger) (con integer 11)]) (con integer 22)])",
    "(program 1.0.0 (force [[(builtin multiplyInteger) (con integer 11)] (con integer 22)]))",
    "(program 1.0.0 [(builtin decodeUtf8) (con bytestring #A3)])",
    "(program 1.0.0 [(builtin divideInteger) (con integer 1) (con integer 0)])",
    "(program 1.0.0 [(force (builtin headList)) (con (list integer) [])])",
    "(program 1.0.0 [(force (builtin headList)) [(builtin mkNilData) (con unit ())]])",
    "(program 1.0.0 [(force (builtin ifThenElse)) (con bool False) (error) (con integer 42)])",
    "(program 1.0.0 [[[(force (builtin ifThenElse)) (con integer 1)] (con integer 11)] (con integer -22)])",
    "(program 1.0.0 [[[(force (builtin ifThenElse)) (lam x (lam y x))] (con integer 11)] (con integer -22)])",
    "(program 1.0.0 [[[(builtin ifThenElse) (con bool True)] (con integer 0)] (con integer 1)])",
    "(program 1.0.0 [(builtin indexByteString) (con bytestring #00) (con integer 1)])",
    "(program 1.0.0 [(builtin indexByteString) (con bytestring #00) (con integer 9223372036854775808)])",
    "(program 1.0.0 [(force (builtin mkCons)) (con integer 3) [(builtin mkNilData) (con unit ())]])",
    "(program 1.0.0 [(builtin modInteger) (con integer 1) (con integer 0)])",
    "(program 1.0.0 [(builtin quotientInteger) (con integer 1) (con integer 0)])",
    "(program 1.0.0 [(builtin remainderInteger) (con integer 1) (con integer 0)])",
    "(program 1.0.0 [(force (builtin tailList)) (con (list integer) [])])",
    "(program 1.0.0 [(force (builtin tailList)) [(builtin mkNilData) (con unit ())]])",
    "(program 1.0.0 [(force (builtin addInteger)) (con integer 5) (con integer 6)])",
    "(program 1.0.0 (force (con integer 5)))",
    "(program 1.0.0 (force (lam x x)))",
    "(program 1.0.0 [(con integer 3) (con integer 4)])",
    "(program 1.0.0 [(builtin addInteger) (con unit ()) (con integer 3)])",
    "(program 1.0.0 [[(builtin remainderInteger) [(lam x0 [[(builtin addInteger) [(lam x1 [[(builtin addInteger) (con integer 3)] (con integer 3)]) [[(builtin lessThanInteger) (con integer 1)] (con integer 0)]]] [(lam x2 [[(builtin subtractInteger) (con integer 1)] (con integer 3)]) [[(builtin equalsByteString) (con bytestring #7063)] (con bytestring #716466)]]]) [(builtin sha2_256) [[(builtin appendByteString) [(builtin sha2_256) (con bytestring #67696d)]] [(builtin sha2_256) (con bytestring #767174)]]]]] (con integer 0)])",
    "(program 1.0.0 [[(force (force (delay (delay (lam x (lam y x)))))) (con integer 0)] [[(builtin divideInteger) [(lam x0 [(lam x2 x2) [[(builtin multiplyInteger) [[(builtin multiplyInteger) (con integer 2)] (con integer 0)]] [[(builtin subtractInteger) (con integer 1)] (con integer 1)]]]) [(lam x1 (con integer 1)) [[(builtin subtractInteger) [[(builtin multiplyInteger) (con integer 2)] (con integer 3)]] [[(builtin multiplyInteger) (con integer 2)] (con integer 2)]]]]] (con integer 0)]])"
]

describe(`UplcProgramV1 conformance`, () => {
    conformanceTests.forEach(({ src, mem, cpu, result: expectedResult }) => {
        it(src, () => {
            const program = parseUplcProgramV1(src)

            const { result, cost } = program.eval(undefined, {
                costModelParams: BABBAGE_COST_MODEL_PARAMS_V1
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
    })

    syntaxErrorTests.forEach((s) => {
        it(`fails to parse "${s}"`, () => {
            throws(() => {
                parseUplcProgramV1(s)
            })
        })
    })

    runtimeErrorTests.forEach((s) => {
        it(`fails to run ${s}`, () => {
            const program = parseUplcProgramV1(s)

            const { result } = program.eval(undefined)
            throws(() => expectRight(result))
        })
    })
})
