import {
    decodeInt,
    decodeTuple,
    encodeInt,
    encodeTuple
} from "@helios-lang/cbor"

/**
 * @import { BytesLike } from "@helios-lang/codec-utils"
 * @import { Cost } from "../index.js"
 */

/**
 * Decode Cost CBOR bytes
 * @param {BytesLike} bytes
 * @returns {Cost}
 */
export function decodeCost(bytes) {
    const [mem, cpu] = decodeTuple(bytes, [decodeInt, decodeInt])

    return { cpu, mem }
}

/**
 * Encode Cost using CBOR
 * @param {Cost} cost
 * @returns {number[]}
 */
export function encodeCost(cost) {
    return encodeTuple([encodeInt(cost.mem), encodeInt(cost.cpu)])
}
