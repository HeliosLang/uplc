/**
 * @import { AssertExtends } from "@helios-lang/type-utils"
 * @import {
 *   BasicUplcLogger,
 *   Bls12_381_G1_element,
 *   Bls12_381_G2_element,
 *   Bls12_381_MlResult,
 *   Builtin,
 *   BuiltinContext,
 *   BuiltinCostModel,
 *   ByteArrayData,
 *   CekCaseScrutineeFrame,
 *   CekConstrArgFrame,
 *   CekContext,
 *   CekForceFrame,
 *   CekFrame,
 *   CekLeftApplyToTermFrame,
 *   CekLeftApplyToValueFrame,
 *   CekMachine,
 *   CekResult,
 *   CekRightApplyFrame,
 *   CekState,
 *   CekTerm,
 *   CekValue,
 *   ConstrData,
 *   Cost,
 *   CostTracker,
 *   FlatWriter,
 *   IntData,
 *   ListData,
 *   MapData,
 *   PlutusVersion,
 *   PlutusVersionTag,
 *   UplcApply,
 *   UplcBool,
 *   UplcBuiltin,
 *   UplcByteArray,
 *   UplcCall,
 *   UplcConst,
 *   UplcConstr,
 *   UplcData,
 *   UplcDataValue,
 *   UplcDelay,
 *   UplcError,
 *   UplcForce,
 *   UplcInt,
 *   UplcLambda,
 *   UplcList,
 *   UplcLogger,
 *   UplcPair,
 *   UplcProgramV1,
 *   UplcProgramV2,
 *   UplcProgramV3,
 *   UplcRuntimeError,
 *   UplcString,
 *   UplcTerm,
 *   UplcType,
 *   UplcUnit,
 *   UplcValue,
 *   UplcVar,
 *   UplcVersion
 * } from "./index.js"
 */

/**
 * Builtin
 * @typedef {AssertExtends<BuiltinCostModel, Builtin>} BuiltinExtendsBuiltinCostModel
 */

/**
 * Cost
 *
 * @typedef {AssertExtends<Cost, CostTracker>} CostTrackerExtendsCost
 */

/**
 * Loggers
 *
 * @typedef {AssertExtends<UplcLogger, BasicUplcLogger>} BasicUplcLoggerExtendsUplcLogger
 */

/**
 * Uplc terms
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriter) => void
 *   children: UplcTerm[]
 * }} CommonUplcTermProps
 *
 * @typedef {AssertExtends<CommonUplcTermProps, UplcApply>} UplcApplyExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcBuiltin>} UplcBuiltinExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcCall>} UplcCallExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcConst>} UplcConstExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcConstr>} UplcConstrExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcDelay>} UplcDelayExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcError>} UplcErrorExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcForce>} UplcForceExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcLambda>} UplcLambdaExtendsCommonUplcTermProps
 * @typedef {AssertExtends<CommonUplcTermProps, UplcVar>} UplcVarExtendsCommonUplcTermProps
 */

/**
 * Cek frames
 * @typedef {{
 *   reduce: (frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState
 * }} CommonCekFrameProps
 *
 * @typedef {AssertExtends<CommonCekFrameProps, CekForceFrame>} CekForceFrameExtendsCekFrame
 * @typedef {AssertExtends<CommonCekFrameProps, CekLeftApplyToTermFrame>} CekLeftApplyToTermFrameExtendsCekFrame
 * @typedef {AssertExtends<CommonCekFrameProps, CekLeftApplyToValueFrame>} CekLeftApplyToValueFrameExtendsCekFrame
 * @typedef {AssertExtends<CommonCekFrameProps, CekRightApplyFrame>} CekRightApplyFrameExtendsCekFrame
 * @typedef {AssertExtends<CommonCekFrameProps, CekConstrArgFrame>} CekConstrArgFrameExtendsCekFrame
 * @typedef {AssertExtends<CommonCekFrameProps, CekCaseScrutineeFrame>} CekCaseScrutineeFrameExtendsCekFrame
 */

/**
 * Contexts
 * @typedef {AssertExtends<BuiltinContext, CekContext>} CekContextExtendsBuiltinContext
 * @typedef {AssertExtends<CekContext, CekMachine>} CekMachineExtendsCekContext
 */

/**
 * Uplc primitive values
 * @typedef {{
 *   memSize: number
 *   flatSize: number
 *   type: UplcType
 *   isEqual: (other: UplcValue) => boolean
 *   toFlat: (writer: FlatWriter) => void
 *   toString: () => string
 * }} CommonUplcValueProps
 *
 * @typedef {AssertExtends<CommonUplcValueProps, UplcInt>} UplcIntExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcByteArray>} UplcByteArrayExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcString>} UplcStringExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcUnit>} UplcUnitExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcBool>} UplcBoolExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcList>} UplcListExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcPair>} UplcPairExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, UplcDataValue>} UplcDataValueExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, Bls12_381_G1_element>} Bls12_381_G1_elementExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, Bls12_381_G2_element>} Bls12_381_G2_elementExtendsCommonUplcValueProps
 * @typedef {AssertExtends<CommonUplcValueProps, Bls12_381_MlResult>} Bls12_381_MlResultExtendsCommonUplcValueProps
 */

/**
 * Uplc data values
 * @typedef {{
 *   memSize: number
 *   isEqual: (other: UplcData) => boolean
 *   toCbor: () => number[]
 *   toSchemaJson: () => string
 *   toString: () => string
 *   rawData?: any
 *   dataPath?: string
 * }} CommonUplcDataProps
 *
 * @typedef {AssertExtends<CommonUplcDataProps, ByteArrayData>} ByteArrayDataExtendsCommonUplcDataProps
 * @typedef {AssertExtends<CommonUplcDataProps, ConstrData>} ConstrDataExtendsCommonUplcDataProps
 * @typedef {AssertExtends<CommonUplcDataProps, IntData>} IntDataExtendsCommonUplcDataProps
 * @typedef {AssertExtends<CommonUplcDataProps, ListData>} ListDataExtendsCommonUplcDataProps
 * @typedef {AssertExtends<CommonUplcDataProps, MapData>} MapDataExtendsCommonUplcDataProps
 */

/**
 * Uplc programs
 * @template T
 * @typedef {{
 *   plutusVersion: PlutusVersion
 *   plutusVersionTag: PlutusVersionTag
 *   uplcVersion: UplcVersion
 *   alt?: T
 *   apply(args: UplcValue[]): T
 *   withAlt(alt: T): T
 *   root: UplcTerm
 *   ir?: string
 *   eval(args: UplcValue[] | undefined, options?: {
 *      logOptions?: UplcLogger,
 *      costModelParams?: number[],
 *   }): CekResult
 *   hash(): number[]
 *   toCbor(): number[]
 *   toFlat(): number[]
 *   toString(): string
 * }} CommonUplcProgramProps
 *
 * @typedef {AssertExtends<CommonUplcProgramProps<UplcProgramV1>, UplcProgramV1>} UplcProgramV1ExtendsCommonUplcProgramProps
 * @typedef {AssertExtends<CommonUplcProgramProps<UplcProgramV2>, UplcProgramV2>} UplcProgramV2ExtendsCommonUplcProgramProps
 * @typedef {AssertExtends<CommonUplcProgramProps<UplcProgramV3>, UplcProgramV3>} UplcProgramV3ExtendsCommonUplcProgramProps
 */

/**
 * Errors
 * @typedef {AssertExtends<Error, UplcRuntimeError>} UplcRuntimErrorExtendsError
 */
