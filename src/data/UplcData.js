/**
 * Interface for Plutus-core data classes (not the same as Plutus-core value classes!)
 * @typedef {ByteArrayDataI | ConstrDataI | IntDataI | ListDataI | MapDataI} UplcData
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
 * }} ByteArrayDataI
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "constr"
 *   tag: number
 *   fields: UplcData[]
 *   length: number
 *   expectFields: (n: number) => ConstrDataI
 *   expectTag: (tag: number, msg?: string) => ConstrDataI
 * }} ConstrDataI
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "int"
 *   value: bigint
 * }} IntDataI
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "list"
 *   items: UplcData[]
 *   length: number
 *   list: UplcData[]
 * }} ListDataI
 */

/**
 * @typedef {CommonUplcDataProps & {
 *   kind: "map"
 *   items: [UplcData, UplcData][]
 *   length: number
 *   list: [UplcData, UplcData][]
 * }} MapDataI
 */

/**
 * Min memory used by a UplcData value during on-chain evaluation.
 * @type {number}
 */
export const UPLC_DATA_NODE_MEM_SIZE = 4
