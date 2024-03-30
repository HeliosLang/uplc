import {
    decodeInt,
    decodeTuple,
    encodeInt,
    encodeTuple
} from "@helios-lang/cbor"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 */

/**
 * @typedef {{
 *   cpu: bigint
 *   mem: bigint
 * }} Cost
 */

/**
 * Decode Cost CBOR bytes
 * @param {ByteArrayLike} bytes
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
