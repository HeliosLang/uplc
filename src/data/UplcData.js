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
 * Min memory used by a UplcData value during on-chain evaluation.
 * @type {number}
 */
export const UPLC_DATA_NODE_MEM_SIZE = 4
