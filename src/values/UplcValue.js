import { FlatWriter } from "../flat/index.js"
import { UplcType } from "./UplcType.js"

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
 * }} UplcValue
 */
