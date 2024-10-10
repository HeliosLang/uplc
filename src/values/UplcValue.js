export {}

/**
 * @typedef {import("@helios-lang/crypto").FieldElement12} FieldElement12
 * @typedef {import("../data/index.js").ConstrDataI} ConstrDataI
 * @typedef {import("../data/index.js").UplcData} UplcData
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
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
 *   isEqual(other: UplcTypeI): boolean
 *   toString(): string
 * }} UplcTypeI
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
 *   type: UplcTypeI
 *   isEqual: (other: UplcValue) => boolean
 *   toFlat: (writer: FlatWriterI) => void
 *   toString: () => string
 * }} CommonUplcValueProps
 */

/**
 * @typedef {(
 *   UplcIntI
 *   | UplcByteArrayI
 *   | UplcStringI
 *   | UplcUnitI
 *   | UplcBoolI
 *   | UplcListI
 *   | UplcPairI
 *   | UplcDataValueI
 *   | Bls12_381_G1_elementI
 *   | Bls12_381_G2_elementI
 *   | Bls12_381_MlResultI
 * )} UplcValue
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "int"
 *   value: bigint
 *   signed: boolean
 *   toFlatUnsigned: (w: FlatWriterI) => void
 *   toSigned: () => UplcIntI
 *   toUnsigned: () => UplcIntI
 * }} UplcIntI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bytes"
 *   bytes: number[]
 * }} UplcByteArrayI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "string"
 *   value: string
 *   string: string
 * }} UplcStringI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "unit"
 * }} UplcUnitI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bool"
 *   value: boolean
 *   bool: boolean
 *   toUplcData: () => ConstrDataI
 * }} UplcBoolI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "list"
 *   itemType: UplcTypeI
 *   items: UplcValue[]
 *   length: number
 *   isDataList: () => boolean
 *   isDataMap: () => boolean
 * }} UplcListI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "pair"
 *   first: UplcValue
 *   second: UplcValue
 * }} UplcPairI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "data"
 *   value: UplcData
 * }} UplcDataValueI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_G1_element"
 *   point: Point3<bigint>
 *   compress: () => number[]
 * }} Bls12_381_G1_elementI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_G2_element"
 *   point: Point3<[bigint, bigint]>
 *   compress: () => number[]
 * }} Bls12_381_G2_elementI
 */

/**
 * @typedef {CommonUplcValueProps & {
 *   kind: "bls12_381_mlresult"
 *   element: FieldElement12
 * }} Bls12_381_MlResultI
 */
