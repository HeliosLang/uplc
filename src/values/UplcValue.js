export {}

/**
 * @typedef {import("@helios-lang/crypto").FieldElement12} FieldElement12
 * @typedef {import("../data/index.js").ConstrData} ConstrData
 * @typedef {import("../data/index.js").UplcData} UplcData
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 */

/**
 * @template T
 * @typedef {import("@helios-lang/crypto").Point3<T>} Point3
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
