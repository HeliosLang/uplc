/**
 * Interface for Plutus-core data classes (not the same as Plutus-core value classes!)
 * @typedef {{
 *   memSize: number
 *   isEqual: (other: UplcData) => boolean
 *   toCbor: () => number[]
 *   toSchemaJson: () => string
 *   toString: () => string
 * }} UplcData
 */

/**
 * Min memory used by a UplcData value during on-chain evaluation.
 * @type {number}
 */
export const UPLC_DATA_NODE_MEM_SIZE = 4
