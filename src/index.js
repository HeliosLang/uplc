export {
    builtinsV1,
    builtinsV1Map,
    builtinsV2,
    builtinsV2Map,
    builtinsV3,
    builtinsV3Map
} from "./builtins/index.js"
export {
    isUplcRuntimeError,
    makeCekCaseScrutineeFrame,
    makeCekConstrArgFrame,
    makeCekForceFrame,
    makeCekLeftApplyToTermFrame,
    makeCekLeftApplyToValueFrame,
    makeCekMachine,
    makeCekRightApplyFrame,
    makeUplcRuntimeError
} from "./cek/index.js"
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
    makeUplcApply,
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
 * @typedef {object} ArgSizesCost
 * @prop {(argSizes: bigint[]) => bigint} calcCost
 */

/**
 * @typedef {(params: CostModelParamsProxy) => ArgSizesCost} ArgSizesCostClass
 */

/**
 * @typedef {(args: CekValue[], ctx: BuiltinContext) => CekValue} BuiltinCallback
 */

/**
 * @typedef {{
 *   name: string
 *   cpuModel: ArgSizesCostClass
 *   memModel: ArgSizesCostClass
 * }} BuiltinCostModel
 */

/**
 * @typedef {object} Builtin
 * @prop {string} name
 * @prop {ArgSizesCostClass} cpuModel
 * @prop {ArgSizesCostClass} memModel
 * @prop {number} forceCount
 * @prop {number} nArgs
 * @prop {BuiltinCallback} call
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
 * @typedef {object} BuiltinContext
 * The context that the builting functions need to operate.
 *
 * @prop {(message: string) => void} print
 */

/**
 * TODO: rename to CEKContext
 * @typedef {object} CekContext
 * The context that CEK terms and frames need to operate.
 *
 * @prop {(message: string, site?: Site | undefined) => void} print
 * @prop {CostTracker} cost
 * @prop {(id: number) => (undefined | Builtin)} getBuiltin
 * @prop {() => string | undefined} popLastMessage
 */

/**
 * TODO: rename to CEKMachine
 * @typedef {object} CekMachine
 * The `CekMachine` extends the `CekContext` interface.
 *
 * Use `makeCekMachine` to create a initialize a new CekMachine
 *
 * @prop {(message: string, site?: Site | undefined) => void} print
 * @prop {CostTracker} cost
 * @prop {(id: number) => (undefined | Builtin)} getBuiltin
 * @prop {Builtin[]} builtins
 * @prop {() => string | undefined} popLastMessage
 * @prop {() => CekResult} eval
 * @prop {CekState} state
 * @prop {{message: string, site?: Site}[]} logs
 * @prop {UplcLogger | undefined} diagnostics
 */

/**
 * Information which is helpful when debugging
 * @typedef {{
 *   callSite?: Site
 *   name?: string
 *   argName?: string
 * }} CekApplyInfo
 */

/**
 * @typedef {(
 *   CekForceFrame
 *   | CekLeftApplyToTermFrame
 *   | CekLeftApplyToValueFrame
 *   | CekRightApplyFrame
 *   | CekConstrArgFrame
 *   | CekCaseScrutineeFrame
 * )} CekFrame
 */

/**
 * TODO: rename to CEKForceFrame
 * @typedef {object} CekForceFrame
 * Equivalent to the $(\text{force}~_)$ frame in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * @prop {CekEnv} env
 * @prop {Site | undefined} callSite
 * @prop {(frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transitions in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * \begin{aligned}
 * (\texttt{force}~\_)\cdot s&\triangleleft\langle\texttt{delay}~M~\rho\rangle~&&\mapsto~s;\rho\triangleright~M\\
 * (\texttt{force}~\_)\cdot s&\triangleleft\langle\texttt{builtin}~b~\overline{V}~(\iota\cdot\eta)\rangle~&&\mapsto~s\triangleleft\langle\texttt{builtin}~b~\overline{V}~\eta\rangle\\
 * (\texttt{force}~\_)\cdot s&\triangleleft\langle\texttt{builtin}~b~\overline{V}~[\iota]\rangle~&&\mapsto~\textsf{Eval}_\textsf{CEK}(s,b,\overline{V})
 * \end{aligned}
 * $$
 */

/**
 * TODO: rename to CEKLeftApplyToTermFrame
 * @typedef {object} CekLeftApplyToTermFrame
 * Equivalent to the $[\_~(M,\rho)]$ frame in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `arg` is equivalent to $M$
 *    - `env` is equivalent to $\rho$
 *
 * @prop {CekTerm} arg
 * @prop {CekEnv} env
 * @prop {Site | undefined} callSite
 * @prop {(frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * [\_~(M,\rho)]\cdot s\triangleleft V~\mapsto~[V~\_]\cdot s;\rho\triangleright M
 * $$
 */

/**
 * TODO: rename to CEKLeftApplyToValueFrame
 * @typedef {object} CekLeftApplyToValueFrame
 *  * Equivalent to $[\_~V]$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `rhs` is equivalent to $V$
 *
 * @prop {CekValue} rhs
 * @prop {CekEnv} env
 * @prop {Site | undefined} callSite
 * @prop {(frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transitions in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * \begin{aligned}
 * [\_~V]\cdot s &\triangleleft\langle\texttt{lam}~x~M~\rho\rangle~&&\mapsto~s;\rho[x\mapsto V]\triangleright M\\
 * [\_~V]\cdot s &\triangleleft\langle\texttt{builtin}~b~\overline{V}~(\iota\cdot\eta)\rangle\triangleleft V~&&\mapsto~s\triangleleft\langle\texttt{builtin}~b~(\overline{V}\cdot V)~\eta\rangle\\
 * [\_~V]\cdot s &\triangleleft\langle\texttt{builtin}~b~\overline{V}~[\iota]\rangle~&&\mapsto~\textsf{Eval}_\textsf{CEK}(s,b,\overline{V}\cdot V)
 * \end{aligned}
 * $$
 */

/**
 * TODO: CEKRightApplyFrame
 * @typedef {object} CekRightApplyFrame
 * Equivalent to $[V~\_]$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `fn` is equivalent to $V$
 *
 * @prop {CekValue} fn
 * @prop {CekEnv} env
 * @prop {CekApplyInfo} info
 * @prop {(frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transitions in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * \begin{aligned}
 * [\langle\texttt{lam}~x~M~\rho\rangle~\_]\cdot s &\triangleleft V~&&\mapsto~s;\rho[x\mapsto V]\triangleright M\\
 * [\langle\texttt{builtin}~b~\overline{V}~(\iota\cdot\eta)\rangle~\_]\cdot s &\triangleleft V~&&\mapsto~s\triangleleft\langle\texttt{builtin}~b~(\overline{V}\cdot V)~\eta\rangle\\
 * [\langle\texttt{builtin}~b~\overline{V}~[\iota]\rangle~\_]\cdot s &\triangleleft V~&&\mapsto~\textsf{Eval}_\textsf{CEK}(s,b,\overline{V}\cdot V)
 * \end{aligned}
 * $$
 */

/**
 * TODO: rename to CEKConstrArgFrame
 * @typedef {object} CekConstrArgFrame
 * Equivalent to the $(\texttt{constr}~i~\overline{V}~\_~(\overline{M},\rho))$ frame in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `tag` is equivalent to $i$
 *    - `evaluatedArgs` is equivalent to $\overline{V}$
 *    - `pendingArgs` is equivalent to $\overline{M}$
 *    - `env` is equivalent to $\rho$
 *
 * @prop {number} tag
 * @prop {CekValue[]} evaluatedArgs
 * @prop {CekTerm[]} pendingArgs
 * @prop {CekEnv} env
 * @prop {(frams: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transitions in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * \begin{aligned}
 * (\texttt{constr}~i~\overline{V}~\_~(M\cdot\overline{M},\rho))\cdot s &\triangleleft V~&&\mapsto~(\texttt{constr}~i~\overline{V}\cdot V~\_~(\overline{M},\rho))\cdot s;\rho\triangleright M\\
 * (\texttt{constr}~i~\overline{V}~\_~([],\rho))\cdot s&\triangleleft V~&&\mapsto~s\triangleleft\langle\texttt{constr}~i~\overline{V}\cdot V\rangle
 * \end{aligned}
 * $$
 */

/**
 * TODO: rename to CEKCaseScrutineeFrame
 * @typedef {object}  CekCaseScrutineeFrame
 * Equivalent to the $(\texttt{case}~\_~(\overline{M},\rho))$ frame in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `cases` is equivalent to $\overline{M}$
 *    - `env` is equivalent to $\rho$
 *
 * @prop {CekTerm[]} cases
 * @prop {CekEnv} env
 * @prop {(frames: CekFrame[], value: CekValue, ctx: CekContext) => CekState} reduce
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * (\texttt{case}~\_~(M_0\ldots M_n,\rho))\cdot s\triangleleft\langle\texttt{constr}~i~V_1 \ldots V_m\rangle~\mapsto~[\_~V_m]\ldots[\_~V_1]\cdot s;\rho \triangleright M_i
 * $$
 */

/**
 * TODO: rename to CEKResult
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
 * Return value is optional and can be omitted if the UplcValue doesn't suffice to contain it (eg. lambda functions).
 */

/**
 * TODO: rename to CEKEnv
 * @typedef {{
 *   values: CekValue[]
 *   callSites: CallSiteInfo[]
 * }} CekEnv
 * `CekEnv` contains a stack of variable values, and a stack for call sites (useful for debugging).
 */

/**
 * TODO: rename to CEKComputingState
 * @typedef {{
 *   kind: "computing"
 *   term: CekTerm
 *   env: CekEnv
 *   frames: CekFrame[]
 * }} CekComputingState
 * `CekComputingState` is equivalent to $s; \rho \triangleright M$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `term` is equivalent to $M$
 *    - `env` is equivalent to $\rho$
 *    - `frames` is equivalent to $s$
 */

/**
 * TODO: rename to CEKReducingState
 * @typedef {{
 *   kind: "reducing"
 *   value: CekValue
 *   frames: CekFrame[]
 * }} CekReducingState
 * `CekReducingState` is equivalent to $s \triangleleft V$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `value` is equivalent to $V$
 *    - `frames` is equivalent to $s$
 */

/**
 * TODO: rename to CEKErrorState
 * @typedef {{
 *   kind: "error"
 *   message: string
 *   env: CekEnv
 * }} CekErrorState
 * `CekErrorState` is equivalent to $\text{\diamond}$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * The `message` and `env` fields aren't required by the spec, but are useful for debugging.
 */

/**
 * TODO: rename to CEKSuccessState
 * @typedef {{
 *   kind: "success"
 *   value: CekValue
 * }} CekSuccessState
 * `CekSuccessState` is equivalent to $\square V$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `value` is equivalent to $V$
 */

/**
 * TODO: rename to CEKState
 * @typedef {(
 *   CekComputingState
 *   | CekReducingState
 *   | CekErrorState
 *   | CekSuccessState
 * )} CekState
 * `CekState` is equivalent to $\Sigma$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf).
 */

/**
 * TODO: rename to CEKTerm
 * @typedef {object} CekTerm
 * The `CekTerm` interface is extended by more specific Uplc terms.
 *
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * @prop {() => string} toString
 */

/**
 * TODO: rename to CEKValue
 * @typedef {(
 *   CekConstValue
 *   | CekDelayedValue
 *   | CekLambdaValue
 *   | CekBuiltinValue
 *   | CekConstrValue
 * )} CekValue
 * `CekValue` is a generalized UplcValue, which is equivalent to $V$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf).
 */

/**
 * TODO: rename to CEKConstValue
 * @typedef {{
 *   kind: "const"
 *   value: UplcValue
 *   name?: string
 * }} CekConstValue
 * `CekConstValue` is equivalent to $\langle \texttt{con}~T~c\rangle$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf).
 *
 *    - `value` contains information related to both $T$ and $c$
 *
 * The optional `name` field is used for debugging.
 */

/**
 * TODO: rename to CEKDelayedValue
 * @typedef {{
 *   kind: "delay"
 *   term: CekTerm
 *   env: CekEnv
 *   name?: string
 * }} CekDelayedValue
 * `CekDelayedValue` is equivalent to $\langle \texttt{delay}~M~\rho\rangle$ in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `term` is equivalent to $M$
 *    - `env` is equivalent to $\rho$
 *
 * The optional `name` field is used for debugging.
 */

/**
 * TODO: rename to CEKLambdaValue
 * @typedef {{
 *   kind: "lambda"
 *   body: CekTerm
 *   env: CekEnv
 *   argName?: string
 *   name?: string
 * }} CekLambdaValue
 * `CekLambdaValue` is equivalent to $\langle \texttt{lam}~x~M~\rho\rangle$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `body` is equivalent to $M$
 *    - `env` is equivalent to $\rho$
 *    - `argName` is an optional alternative name for $x$, which is useful during debugging
 *
 * The optional `name` field is used for debugging.
 */

/**
 * TODO: rename to CEKConstrValue
 * @typedef {{
 *   kind: "constr"
 *   tag: number
 *   args: CekValue[]
 *   name?: string
 * }} CekConstrValue
 * `CekConstrValue` is equivalent to $\langle \texttt{constr}~i~\overline{V}\rangle$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `tag` is equivalent to $i$
 *    - `args` is equivalent to $\overline{V}$
 *
 * The optional `name` is used for debugging.
 */

/**
 * TODO: rename to CEKBuiltinValue
 * @typedef {{
 *   kind: "builtin"
 *   id: number
 *   forceCount: number
 *   args: CekValue[]
 *   name: string
 * }} CekBuiltinValue
 * `CekBuiltinValue` is equivalent to $\langle \texttt{builtin}~b~\overline{V}~\eta\rangle$ in the *CEK Machine* section of the [plutus core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 *    - `id` is equivalent to $b$
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
 * @typedef {object} CostModel
 * @prop {Cost} applyTerm
 * @prop {Cost} builtinTerm
 * @prop {Cost} caseTerm
 * @prop {Cost} constTerm
 * @prop {Cost} constrTerm
 * @prop {Cost} delayTerm
 * @prop {Cost} forceTerm
 * @prop {Cost} lambdaTerm
 * @prop {Cost} startupTerm
 * @prop {Cost} varTerm
 * @prop {Record<string, (argSizes: bigint[]) => Cost>} builtins
 */

/**
 * @typedef {object} CostModelParamsProxy
 * @prop {(key: number, def?: bigint | undefined) => bigint} get
 */

/**
 * @typedef {object} CostTracker
 * @prop {bigint} cpu
 * @prop {bigint} mem
 * @prop {CostModel} costModel
 * @prop {CostBreakdown} breakdown
 * @prop {() => void} incrApplyCost
 * @prop {() => void} incrBuiltinCost
 * @prop {() => void} incrCaseCost
 * @prop {() => void} incrConstCost
 * @prop {() => void} incrConstrCost
 * @prop {() => void} incrDelayCost
 * @prop {() => void} incrForceCost
 * @prop {() => void} incrLambdaCost
 * @prop {() => void} incrStartupCost
 * @prop {() => void} incrVarCost
 * @prop {(name: string, argSizes: bigint[]) => void} incrArgSizesCost
 */

/**
 * @typedef {object} FlatReader
 * @prop {(n: number) => number} readBits
 * @prop {() => boolean} readBool
 * @prop {() => number} readBuiltinId
 * @prop {() => number[]} readBytes
 * @prop {() => bigint} readInt
 * @prop {() => number} readTag
 * @prop {<T>(readItem: (r: FlatReader) => T) => T[]} readList
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
 * Interfaces for Plutus-core data classes (not the same as Plutus-core value classes!)
 * @typedef {ByteArrayData | ConstrData | IntData | ListData | MapData} UplcData
 */

/**
 * @typedef {object} ByteArrayData
 * @prop {"bytes"} kind
 * @prop {number[]} bytes
 * @prop {() => string} toHex
 * @prop {number} memSize
 * @prop {(other: UplcData) => boolean} isEqual
 * @prop {() => number[]} toCbor
 * @prop {() => string} toSchemaJson
 * @prop {() => string} toString
 * @prop {any} [rawData]
 * @prop {string} [dataPath]
 */

/**
 * @typedef {object} ConstrData
 * @prop {"constr"} kind
 * @prop {number} tag
 * @prop {UplcData[]} fields
 * @prop {number} length
 * @prop {(n: number) => ConstrData}  expectFields
 * @prop {(tag: number, msg?: string) => ConstrData}  expectTag
 * @prop {number} memSize
 * @prop {(other: UplcData) => boolean} isEqual
 * @prop {() => number[]} toCbor
 * @prop {() => string} toSchemaJson
 * @prop {() => string} toString
 * @prop {any} [rawData]
 * @prop {string} [dataPath]
 */

/**
 * @typedef {object} IntData
 * @prop {"int"} kind
 * @prop {bigint} value
 * @prop {number} memSize
 * @prop {(other: UplcData) => boolean} isEqual
 * @prop {() => number[]} toCbor
 * @prop {() => string} toSchemaJson
 * @prop {() => string} toString
 * @prop {any} [rawData]
 * @prop {string} [dataPath]
 */

/**
 * @typedef {object} ListData
 * @prop {"list"} kind
 * @prop {UplcData[]} items
 * @prop {number} length
 * @prop {number} memSize
 * @prop {(other: UplcData) => boolean} isEqual
 * @prop {() => number[]} toCbor
 * @prop {() => string} toSchemaJson
 * @prop {() => string} toString
 * @prop {any} [rawData]
 * @prop {string} [dataPath]
 */

/**
 * @typedef {object} MapData
 * @prop {"map"} kind
 * @prop {[UplcData, UplcData][]} items
 * @prop {number} length
 * @prop {number} memSize
 * @prop {(other: UplcData) => boolean} isEqual
 * @prop {() => number[]} toCbor
 * @prop {() => string} toSchemaJson
 * @prop {() => string} toString
 * @prop {any} [rawData]
 * @prop {string} [dataPath]
 */

/**
 * TODO: rename to UPLCLogger
 * @typedef {object} UplcLogger
 * Gathers log messages produced by a Helios program
 * Note: `logError` is intended for messages that are passed to console.error() or equivalent, not for the Error messages that are simply part of thrown errors
 *
 * @prop {string} lastMessage
 * @prop {(message: string, site?: Site | undefined) => void} logPrint
 * @prop {(message: string, site?: Site | undefined) => void} [logError]
 * @prop {(message: string, site?: Site | undefined) => void} [logTrace]
 * @prop {() => void} [flush]
 * @prop {(reason: "build" | "validate") => void} [reset]
 */

/**
 * TODO: rename to BasicUPLCLogger
 * @typedef {object} BasicUplcLogger
 * @prop {string} lastMessage
 * @prop {(message: string, site?: Site | undefined) => void} logPrint
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
 * TODO: rename to UPLCProgramV1Options
 * @typedef {{
 *   alt?: UplcProgramV1
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV1Options
 * The optional `ir` property can be lazy because it is only used for debugging and might require an expensive formatting operation
 */

/**
 * TODO: rename to UPLCProgramV2Options
 * @typedef {{
 *   alt?: UplcProgramV2
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV2Options
 * The optional `ir` property can be lazy because it is only used for debugging and might require an expensive formatting operation
 */

/**
 * TODO: rename to UPLCProgramV3Options
 * @typedef {{
 *   alt?: UplcProgramV3
 *   ir?: (() => string) | string
 *   sourceMap?: UplcSourceMapJsonSafe
 * }} UplcProgramV3Options
 * The optional `ir` property can be lazy because it is only used for debugging and might require an expensive formatting operation
 */

/**
 * TODO: rename to UPLCProgramV1
 * @typedef {object} UplcProgramV1
 * @prop {"PlutusScriptV1"} plutusVersion
 * @prop {1} plutusVersionTag
 * @prop {"1.0.0"} uplcVersion
 * @prop {UplcProgramV1} [alt]
 * @prop {(args: UplcValue[]) => UplcProgramV1} apply
 * @prop {(alt: UplcProgramV1) => UplcProgramV1} withAlt
 * @prop {UplcTerm} root
 * @prop {string} [ir]
 * @prop {(
 *   args: UplcValue[] | undefined,
 *   options?: {
 *     logOptions?: UplcLogger,
 *     costModelParams?: number[],
 *   }
 * ) => CekResult} eval
 * @prop {() => number[]} hash
 * @prop {() => number[]} toCbor
 * @prop {() => number[]} toFlat
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCProgramV2
 * @typedef {object} UplcProgramV2
 * @prop {"PlutusScriptV2"} plutusVersion
 * @prop {2} plutusVersionTag
 * @prop {"1.0.0"} uplcVersion
 * @prop {UplcProgramV2} [alt]
 * @prop {(args: UplcValue[]) => UplcProgramV2} apply
 * @prop {(alt: UplcProgramV2) => UplcProgramV2} withAlt
 * @prop {UplcTerm} root
 * @prop {string} [ir]
 * @prop {(
 *   args: UplcValue[] | undefined,
 *   options?: {
 *     logOptions?: UplcLogger,
 *     costModelParams?: number[],
 *   }
 * ) => CekResult} eval
 * @prop {() => number[]} hash
 * @prop {() => number[]} toCbor
 * @prop {() => number[]} toFlat
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCProgramV3
 * @typedef {object} UplcProgramV3
 * @prop {"PlutusScriptV3"} plutusVersion
 * @prop {3} plutusVersionTag
 * @prop {"1.1.0"} uplcVersion
 * @prop {UplcProgramV3} [alt]
 * @prop {(args: UplcValue[]) => UplcProgramV3} apply
 * @prop {(alt: UplcProgramV3) => UplcProgramV3} withAlt
 * @prop {UplcTerm} root
 * @prop {string} [ir]
 * @prop {(
 *   args: UplcValue[] | undefined,
 *   options?: {
 *     logOptions?: UplcLogger,
 *     costModelParams?: number[],
 *   }
 * ) => CekResult} eval
 * @prop {() => number[]} hash
 * @prop {() => number[]} toCbor
 * @prop {() => number[]} toFlat
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCSourceMapJSONSafe
 * @typedef {{
 *   sourceNames: string[]
 *   indices: string // cbor encoded
 *   variableNames?: string // cbor encoded
 *   termDescriptions?: string // cbor encoded
 * }} UplcSourceMapJsonSafe
 */

/**
 * TODO: rename to UPLCSourceMapProps
 * @typedef {{
 *   sourceNames: string[]
 *   indices: number[]
 *   variableNames?: [number, string][]
 *   termDescriptions?: [number, string][]
 * }} UplcSourceMapProps
 */

/**
 * TODO: rename to UPLCSourceMap
 * @typedef {{
 *   apply(root: UplcTerm): void
 *   toJsonSafe(): UplcSourceMapJsonSafe
 * }} UplcSourceMap
 */

/**
 * TODO: rename to UPLCTerm
 * @typedef {(
 *   UplcApply
 *   | UplcBuiltin
 *   | UplcCase
 *   | UplcConst
 *   | UplcConstr
 *   | UplcDelay
 *   | UplcError
 *   | UplcForce
 *   | UplcLambda
 *   | UplcVar
 * )} UplcTerm
 */

/**
 * TODO: rename to UPLCApplyTerm
 * @typedef {object} UplcApply
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s; \rho \triangleright [M~N]~\mapsto~[\_~(N,\rho)]\cdot s; \rho \triangleright M
 * $$
 *
 * This means a `LeftApplyToTermFrame` is added to `frames`, and `fn` is computed next.
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"apply"} kind
 * @prop {UplcTerm} fn
 * @prop {UplcTerm} arg
 */

/**
 * TODO: rename to UPLCBuiltinTerm
 * @typedef {object} UplcBuiltin
 * @prop {UplcTerm[]} children
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright(\texttt{builtin}~b)~\mapsto~s\triangleleft\langle \texttt{builtin}~b~[]~\alpha(b)\rangle
 * $$
 *
 * @prop {number} id
 * @prop {"builtin"} kind
 * @prop {Site | undefined} site
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {() => string} toString
 */

/**
 * @deprecated
 * @typedef {UplcApply} UplcCall
 */

/**
 * TODO: rename to UPLCConstTerm
 * @typedef {object} UplcConst
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s; \rho \triangleright (\texttt{con}~T~c)~\mapsto~s\triangleleft\langle\texttt{con}~T~c\rangle
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"const"} kind
 * @prop {number} flatSize
 * @prop {UplcTerm} serializableTerm
 * @prop {UplcValue} value
 */

/**
 * TODO: rename to UPLCDelayTerm
 * @typedef {object} UplcDelay
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright (\texttt{delay}~M)~\mapsto~s\triangleleft\langle\texttt{delay}~M~\rho\rangle
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"delay"} kind
 * @prop {UplcTerm} arg
 */

/**
 * TODO: rename to UPLCErrorTerm
 * @typedef {object} UplcError
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright(\texttt{error})~\mapsto~\diamond
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"error"} kind
 */

/**
 * TODO: rename to UPLCForceTerm
 * @typedef {object} UplcForce
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright(\texttt{force}~M)~\mapsto~(\texttt{force}~\_)\cdot s;\rho\triangleright M
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"force"} kind
 * @prop {UplcTerm} arg
 */

/**
 * TODO: rename to UPLCLambdaTerm
 * @typedef {object} UplcLambda
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright(\texttt{lam}~x~M)~\mapsto~s\triangleleft\langle \texttt{lam}~x~M~\rho \rangle
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"lambda"} kind
 * @prop {UplcTerm} expr
 * @prop {string | undefined} [argName]
 */

/**
 * TODO: rename to UPLCVarTerm
 * @typedef {object} UplcVar
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright x~\mapsto~s\triangleleft\rho[x] \text{if}x\in\rho
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"var"} kind
 * @prop {number} index
 * @prop {string | undefined} [name]
 */

/**
 * TODO: rename to UPLCConstrTerm
 * @typedef {object} UplcConstr
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transitions in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * \begin{aligned}
 * s;\rho&\triangleright(\texttt{constr}~i~M\cdot\overline{M})~&&\mapsto~(\texttt{constr}~i~\_~(\overline{M},\rho))\cdot s;\rho\triangleright M\\
 * s;\rho&\triangleright(\texttt{constr}~i~[])~&&\mapsto~s\triangleleft\langle\texttt{constr}~i~[]\rangle
 * \end{aligned}
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"constr"} kind
 * @prop {number} tag
 * @prop {UplcTerm[]} args
 */

/**
 * TODO: rename to UPLCCaseTerm
 * @typedef {object} UplcCase
 * @prop {Site | undefined} site
 * @prop {(frames: CekFrame[], env: CekEnv, ctx: CekContext) => CekState} compute
 * Equivalent to the following transition in the *CEK Machine* section of the [Plutus Core spec](https://plutus.cardano.intersectmbo.org/resources/plutus-core-spec.pdf):
 *
 * $$
 * s;\rho\triangleright(\texttt{case}~N~\overline{M})~\mapsto~(\texttt{case}~\_~(\overline{M},\rho))\cdot s;\rho\triangleright N
 * $$
 *
 * @prop {() => string} toString
 * @prop {(writer: FlatWriter) => void} toFlat
 * @prop {UplcTerm[]} children
 * @prop {"case"} kind
 * @prop {UplcTerm} arg
 * @prop {UplcTerm[]} cases
 */

/**
 * TODO: rename to UPLCType
 * @typedef {{
 *   typeBits: string
 *   isData(): boolean
 *   isDataPair(): boolean
 *   isEqual(other: UplcType): boolean
 *   toString(): string
 * }} UplcType
 */

/**
 * TODO: rename to UPLCValue
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
 * UplcValue instances are passed around by UPLC terms.
 */

/**
 * TODO: rename to UPLCInt
 * @typedef {object} UplcInt
 * @prop {"int"} kind
 * @prop {bigint} value
 * @prop {boolean} signed
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {(w: FlatWriter) => void} toFlatUnsigned
 * @prop {() => string} toString
 * @prop {() => UplcInt} toSigned
 * @prop {() => UplcInt} toUnsigned
 */

/**
 * TODO: rename to UPLCByteArray
 * @typedef {object} UplcByteArray
 * @prop {"bytes"} kind
 * @prop {number[]} bytes
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCString
 * @typedef {object} UplcString
 * @prop {"string"} kind
 * @prop {string} value
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCUnit
 * @typedef {object} UplcUnit
 * @prop {"unit"} kind
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCBool
 * @typedef {object} UplcBool
 * @prop {"bool"} kind
 * @prop {boolean} value
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 * @prop {() => ConstrData} toUplcData
 */

/**
 * TODO: rename to UPLCList
 * @typedef {object} UplcList
 * @prop {"list"} kind
 * @prop {UplcType} type
 * @prop {UplcType} itemType
 * @prop {UplcValue[]} items
 * @prop {number} length
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {() => boolean} isDataList
 * @prop {() => boolean} isDataMap
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCPair
 * @typedef {object} UplcPair
 * @prop {"pair"} kind
 * @prop {UplcValue} first
 * @prop {UplcValue} second
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCDataValue
 * @typedef {object} UplcDataValue
 * Instantiate a `UplcDataValue` with {@link makeUplcDataValue}.
 *
 * @prop {"data"} kind
 * @prop {UplcData} value
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * @typedef {object} Bls12_381_G1_element
 * Instantiate a `Bls12_381_G1_element` value with {@link makeBls12_381_G1_element}.
 *
 * @prop {"bls12_381_G1_element"} kind
 * @prop {Point3<bigint>} point
 * @prop {() => number[]} compress
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * @typedef {object} Bls12_381_G2_element
 * Instantiate a `Bls12_381_G2_element` value with {@link makeBls12_381_G2_element}.
 *
 * @prop {"bls12_381_G2_element"}  kind
 * @prop {Point3<[bigint, bigint]>} point
 * @prop {() => number[]} compress
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * @typedef {object} Bls12_381_MlResult
 * @prop {"bls12_381_mlresult"} kind
 * @prop {FieldElement12} element
 * @prop {number} memSize
 * Size in words (8 bytes, 64 bits) occupied during on-chain evaluation.
 *
 * @prop {number} flatSize
 * Size taken up in serialized Uplc program (number of bits).
 *
 * @prop {UplcType} type
 * @prop {(other: UplcValue) => boolean} isEqual
 * @prop {(writer: FlatWriter) => void} toFlat
 * Serialize as flat format bits (without typeBits).
 *
 * @prop {() => string} toString
 */

/**
 * TODO: rename to UPLCRuntimeError
 * @typedef {object} UplcRuntimeError
 * Instantiate a `UplcRuntimeError` with {@link makeUplcRuntimeError}.
 *
 * @prop {"UplcRuntimeError"} name
 * @prop {string} name
 * @prop {string} message
 * @prop {string | undefined} [stack]
 * @prop {UplcData | undefined} scriptContext
 * @prop {CallSiteInfo[]} frames
 */
