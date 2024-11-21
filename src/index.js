export {
    builtinsV1,
    builtinsV1Map,
    builtinsV2,
    builtinsV2Map,
    builtinsV3,
    builtinsV3Map
} from "./builtins/index.js"
export { UplcRuntimeError } from "./cek/index.js"
export {
    decodeCost,
    encodeCost,
    DEFAULT_COST_MODEL_PARAMS_V1,
    DEFAULT_COST_MODEL_PARAMS_V2,
    DEFAULT_COST_MODEL_PARAMS_V3
} from "./costmodel/index.js"
export {
    assertByteArrayData,
    assertConstrData,
    assertIntData,
    assertListData,
    assertMapData,
    expectByteArrayData,
    expectConstrData,
    expectIntData,
    expectListData,
    expectMapData,
    makeByteArrayData,
    makeConstrData,
    makeIntData,
    makeListData,
    makeMapData,
    uplcDataToBool,
    boolToUplcData,
    unwrapUplcDataOption,
    wrapUplcDataOption,
    uplcDataToReal,
    realToUplcData,
    decodeUplcData
} from "./data/index.js"
export { makeFlatReader, makeFlatWriter } from "./flat/index.js"
export { makeBasicUplcLogger } from "./logging/index.js"
export {
    decodeUplcProgramV1FromCbor,
    decodeUplcProgramV1FromFlat,
    decodeUplcProgramV2FromCbor,
    decodeUplcProgramV2FromFlat,
    decodeUplcProgramV3FromCbor,
    decodeUplcProgramV3FromFlat,
    deserializeUplcSourceMap,
    makeUplcProgramV1,
    makeUplcProgramV2,
    makeUplcProgramV3,
    makeUplcSourceMap,
    restoreUplcProgram
} from "./program/index.js"
export {
    makeUplcBuiltin,
    makeUplcCall,
    makeUplcConst,
    makeUplcDelay,
    makeUplcError,
    makeUplcForce,
    makeUplcLambda,
    makeUplcVar
} from "./terms/index.js"
export {
    makeBls12_381_G1_element,
    makeBls12_381_G2_element,
    makeBls12_381_MlResult,
    makeUplcBool,
    makeUplcByteArray,
    makeUplcDataValue,
    makeUplcInt,
    makeUplcList,
    makeUplcPair,
    makeUplcString,
    makeListType,
    makePairType,
    makeUplcType,
    BLS12_381_G1_ELEMENT_TYPE,
    BLS12_381_G2_ELEMENT_TYPE,
    BLS12_381_ML_RESULT_TYPE,
    BOOL_TYPE,
    BYTE_ARRAY_TYPE,
    DATA_PAIR_TYPE,
    DATA_TYPE,
    INT_TYPE,
    STRING_TYPE,
    UNIT_TYPE,
    UNIT_VALUE
} from "./values/index.js"

/**
 * @import { Site } from "@helios-lang/compiler-utils"
 * @import { FieldElement12, Point3 } from "@helios-lang/crypto"
 * @import { Either } from "@helios-lang/type-utils"
 */

/**
 * @typedef {{
 *   calcCost: (argSizes: bigint[]) => bigint
 * }} ArgSizesCost
 */

/**
 * @typedef {(params: CostModelParamsProxy) => ArgSizesCost} ArgSizesCostClass
 */

/**
 * @typedef {(args: CekValue[], ctx: BuiltinContext) => CekValue} BuiltinCallback
 */

/**
 * @typedef {BuiltinCostModel & {
 *   forceCount: number
 *   nArgs: number
 *   call: BuiltinCallback
 * }} Builtin
 */

/**
 * @typedef {{
 *   print: (message: string) => void
 * }} BuiltinContext
 */

/**
 * @typedef {{
 *   name: string
 *   cpuModel: ArgSizesCostClass
 *   memModel: ArgSizesCostClass
 * }} BuiltinCostModel
 */

/**
 * So we can later add things like env function name, function values
 * @typedef {{
 *   site?: Site
 *   functionName?: string
 *   arguments?: CekValue[]
 * }} CallSiteInfo
 */

/**
 * @typedef {BuiltinContext & {
 *   cost: CostTracker
 *   getBuiltin: (id: number) => (undefined | Builtin)
 *   popLastMessage: () => string | undefined
 *   print: (message: string, site?: Site | undefined) => void
 * }} CekContext
 */

/**
 * @typedef {{
 *   reduce: (value: CekValue, ctx: CekContext) => CekStateChange
 * }} CekFrame
 */

/**
 * Return value is optional and can be omitted if the UplcValue doesn't suffice to contain it (eg. lambda functions)
 * @typedef {{
 *   result: Either<
 *     {
 *       error: string
 *       callSites: CallSiteInfo[]
 *     },
 *     string | UplcValue
 *   >
 *   cost: Cost
 *   logs: {message: string, site?: Site}[]
 *   breakdown: CostBreakdown
 * }} CekResult
 */

/**
 * @typedef {{
 *   values: CekValue[]
 *   callSites: CallSiteInfo[]
 * }} CekStack
 */

/**
 * @typedef {{
 *   computing: {
 *     term: CekTerm
 *     stack: CekStack
 *   }
 * } | {
 *   reducing: CekValue
 * } | {
 *   error: {
 *     message: string
 *     stack: CekStack
 *   }
 * }} CekState
 */

/**
 * @typedef {{
 *   state: CekState
 *   frame?: CekFrame
 * }} CekStateChange
 */

/**
 * @typedef {{
 *   site: Site | undefined
 *   compute(stack: CekStack, ctx: CekContext): CekStateChange
 *   toString(): string
 * }} CekTerm
 */

/**
 * Generalized UplcValue
 * The optional name is used for debugging
 * @typedef {{name?: string} & ({
 *   value: UplcValue
 * } | {
 *   delay: {
 *     term: CekTerm
 *     stack: CekStack
 *   }
 * } | {
 *   lambda: {
 *     term: CekTerm
 *     argName?: string
 *     stack: CekStack
 *   }
 * } | {
 *   builtin: {
 *     id: number
 *     name: string
 *     forceCount: number
 *     args: CekValue[]
 *   }
 * })} CekValue
 */

/**
 * @typedef {{
 *   cpu: bigint
 *   mem: bigint
 * }} Cost
 */

/**
 * @typedef {{
 *   [name: string]: (Cost & {count: number})
 * }} CostBreakdown
 */

/**
 * @typedef {{
 *   builtinTerm: Cost
 *   callTerm: Cost
 *   constTerm: Cost
 *   delayTerm: Cost
 *   forceTerm: Cost
 *   lambdaTerm: Cost
 *   startupTerm: Cost
 *   varTerm: Cost
 *   constrTerm: Cost
 *   caseTerm: Cost
 *   builtins: Record<string, (argSizes: bigint[]) => Cost>
 * }} CostModel
 */

/**
 * @typedef {{
 *   get: (key: number, def?: bigint | undefined) => bigint
 * }} CostModelParamsProxy
 */

/**
 * @typedef {Cost & {
 *   costModel: CostModel
 *   breakdown: CostBreakdown
 *   incrBuiltinCost(): void
 *   incrCallCost(): void
 *   incrConstCost(): void
 *   incrDelayCost(): void
 *   incrForceCost(): void
 *   incrLambdaCost(): void
 *   incrStartupCost(): void
 *   incrVarCost(): void
 *   incrArgSizesCost(name: string, argSizes: bigint[]): void
 * }} CostTracker
 */

/**
 * @typedef {object} FlatReader
 * @prop {() => boolean} readBool
 * @prop {() => number} readBuiltinId
 * @prop {() => number[]} readBytes
 * @prop {() => bigint} readInt
 * @prop {() => number} readTag
 * @prop {(elemSize: number) => number[]} readLinkedList
 * @prop {() => UplcValue} readValue
 * @prop {() => UplcTerm} readExpr
 */

/**
 * @typedef {object} FlatWriter
 * @prop {(b: boolean) => void} writeBool
 * @prop {(bytes: number[]) => void} writeBytes
 * @prop {(x: bigint) => void} writeInt
 * @prop {(items: {toFlat: (w: FlatWriter) => void}[]) => void} writeList
 * @prop {(tag: number) => void} writeTermTag
 * @prop {(typeBits: string) => void} writeTypeBits
 * @prop {(id: number) => void} writeBuiltinId
 * @prop {() => number[]} finalize
 */

/**
 * Interface for Plutus-core data classes (not the same as Plutus-core value classes!)
 * @typedef {ByteArrayData | ConstrData | IntData | ListData | MapData} UplcData
 */

/**
 * @typedef {{
 *   memSize: number
 *   isEqual: (other: UplcData) => boolean
 *   toCbor: () => number[]
 *   toSchemaJson: () => string
 *   toString: () => string
 *   rawData?: any
 *   dataPath?: string
 * }} CommonUplcDataProps
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "bytes"
 *   bytes: number[]
 *   toHex: () => string
 * }} ByteArrayData
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "constr"
 *   tag: number
 *   fields: UplcData[]
 *   length: number
 *   expectFields: (n: number) => ConstrData
 *   expectTag: (tag: number, msg?: string) => ConstrData
 * }} ConstrData
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "int"
 *   value: bigint
 * }} IntData
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "list"
 *   items: UplcData[]
 *   length: number
 *   list: UplcData[]
 * }} ListData
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "map"
 *   items: [UplcData, UplcData][]
 *   length: number
 *   list: [UplcData, UplcData][]
 * }} MapData
 */

/**
 * Gathers log messages produced by a Helios program
 * Note: logError is intended for messages that are passed to console.error() or equivalent, not for the Error messages that are simply part of thrown errors
 * @typedef {{
 *   logPrint: (message: string, site?: Site | undefined) => void
 *   logError?: (message: string, stack?: Site | undefined) => void
 *   lastMessage: string
 *   logTrace?: (message: string, site?: Site | undefined) => void
 *   flush?: () => void
 *   reset? : (reason: "build" | "validate") => void
 * }} UplcLogger
 */

/**
 * @typedef {UplcLogger & {
 *   lastMessage: string
 * }} BasicUplcLogger
 */

/**
 * @typedef {UplcProgramV1 | UplcProgramV2 | UplcProgramV3} UplcProgram
 */

/**
 * @typedef {"1.0.0" | "1.1.0"} UplcVersion
 * @typedef {"PlutusScriptV1" | "PlutusScriptV2" | "PlutusScriptV3"} PlutusVersion
 * @typedef {1 | 2 | 3} PlutusVersionTag
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: UplcProgramV1
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV1Options
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: UplcProgramV2
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV2Options
 */

/**
 * The optional ir property can be lazy because it is only used for debugging and might require an expensive formatting operation
 * @typedef {{
 *   alt?: UplcProgramV3
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV3Options
 */

/**
 * @typedef {{
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
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV1"
 *   plutusVersionTag: 1
 *   uplcVersion: "1.0.0"
 *   alt?: UplcProgramV1
 *   apply: (args: UplcValue[]) => UplcProgramV1
 *   withAlt: (alt: UplcProgramV1) => UplcProgramV1
 * }} UplcProgramV1
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV2"
 *   plutusVersionTag: 2
 *   uplcVersion: "1.0.0"
 *   alt?: UplcProgramV2
 *   apply: (args: UplcValue[]) => UplcProgramV2
 *   withAlt: (alt: UplcProgramV2) => UplcProgramV2
 * }} UplcProgramV2
 */

/**
 * @typedef {CommonUplcProgramProps & {
 *   plutusVersion: "PlutusScriptV3"
 *   plutusVersionTag: 3
 *   uplcVersion: "1.1.0"
 *   alt?: UplcProgramV3
 *   apply: (args: UplcValue[]) => UplcProgramV3
 *   withAlt: (alt: UplcProgramV3) => UplcProgramV3
 * }} UplcProgramV3
 */

/**
 * @typedef {{
 *   sourceNames: string[]
 *   indices: string // cbor encoded
 *   variableNames?: string // cbor encoded
 *   termDescriptions?: string // cbor encoded
 * }} UplcSourceMapJsonSafe
 */

/**
 * @typedef {{
 *   sourceNames: string[]
 *   indices: number[]
 *   variableNames?: [number, string][]
 *   termDescriptions?: [number, string][]
 * }} UplcSourceMapProps
 */

/**
 * @typedef {{
 *   apply(root: UplcTerm): void
 *   toJsonSafe(): UplcSourceMapJsonSafe
 * }} UplcSourceMap
 */

/**
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriter) => void
 *   children: UplcTerm[]
 * }} CommonUplcTermProps
 */

/**
 * @typedef {(
 *   UplcBuiltin
 *   | UplcCall
 *   | UplcConst
 *   | UplcDelay
 *   | UplcError
 *   | UplcForce
 *   | UplcLambda
 *   | UplcVar
 * )} UplcTerm
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "builtin"
 *   id: number
 * }} UplcBuiltin
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "call"
 *   fn: UplcTerm
 *   arg: UplcTerm
 * }} UplcCall
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "const"
 *   flatSize: number
 *   serializableTerm: UplcTerm
 *   value: UplcValue
 * }} UplcConst
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "delay"
 *   arg: UplcTerm
 * }} UplcDelay
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "error"
 * }} UplcError
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "force"
 *   arg: UplcTerm
 * }} UplcForce
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "lambda"
 *   expr: UplcTerm
 *   argName?: string
 * }} UplcLambda
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "var"
 *   index: number
 *   name?: string
 * }} UplcVar
 */

/**
 * @typedef {{
 *   typeBits: string
 *   isData(): boolean
 *   isDataPair(): boolean
 *   isEqual(other: UplcType): boolean
 *   toString(): string
 * }} UplcType
 */

/**
 * UplcValue instances are passed around by Uplc terms.
 *   - memSize: size in words (8 bytes, 64 bits) occupied during on-chain evaluation
 *   - flatSize: size taken up in serialized Uplc program (number of bits)
 *   - typeBits: each serialized value is preceded by some typeBits
 *   - toFlat: serialize as flat format bits (without typeBits)
 *
 * @typedef {{
 *   memSize: number
 *   flatSize: number
 *   type: UplcType
 *   isEqual: (other: UplcValue) => boolean
 *   toFlat: (writer: FlatWriter) => void
 *   toString: () => string
 * }} CommonUplcValueProps
 */

/**
 * @typedef {(
 *   UplcInt
 *   | UplcByteArray
 *   | UplcString
 *   | UplcUnit
 *   | UplcBool
 *   | UplcList
 *   | UplcPair
 *   | UplcDataValue
 *   | Bls12_381_G1_element
 *   | Bls12_381_G2_element
 *   | Bls12_381_MlResult
 * )} UplcValue
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "int"
 *   value: bigint
 *   signed: boolean
 *   toFlatUnsigned: (w: FlatWriter) => void
 *   toSigned: () => UplcInt
 *   toUnsigned: () => UplcInt
 * }} UplcInt
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bytes"
 *   bytes: number[]
 * }} UplcByteArray
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "string"
 *   value: string
 *   string: string
 * }} UplcString
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "unit"
 * }} UplcUnit
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bool"
 *   value: boolean
 *   bool: boolean
 *   toUplcData: () => ConstrData
 * }} UplcBool
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "list"
 *   itemType: UplcType
 *   items: UplcValue[]
 *   length: number
 *   isDataList: () => boolean
 *   isDataMap: () => boolean
 * }} UplcList
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "pair"
 *   first: UplcValue
 *   second: UplcValue
 * }} UplcPair
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "data"
 *   value: UplcData
 * }} UplcDataValue
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_G1_element"
 *   point: Point3<bigint>
 *   compress: () => number[]
 * }} Bls12_381_G1_element
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_G2_element"
 *   point: Point3<[bigint, bigint]>
 *   compress: () => number[]
 * }} Bls12_381_G2_element
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_mlresult"
 *   element: FieldElement12
 * }} Bls12_381_MlResult
 */
