import { padBits } from "@helios-lang/codec-utils"

/**
 * @import { BitReader, BitWriter } from "@helios-lang/codec-utils"
 */

/**
 * 2 to the power 'p' for bigint.
 * @param {bigint} p
 * @returns {bigint}
 */
function pow2(p) {
    return p <= 0n ? 1n : 2n << (p - 1n)
}

/**
 * Combines a list of Plutus-core bytes into a bigint (leading bit of each byte is ignored).
 * Differs from bytesToBigInt in utils.js because only 7 bits are used from each byte.
 * @param {number[]} bytes
 * @returns {bigint}
 */
function decodeIntLE7(bytes) {
    let value = BigInt(0)

    let n = bytes.length

    for (let i = 0; i < n; i++) {
        let b = bytes[i]

        // 7 (not 8), because leading bit isn't used here
        value = value + BigInt(b) * pow2(BigInt(i) * 7n)
    }

    return value
}

/**
 * Parses a single byte in the Plutus-core byte-list representation of an int
 * @param {number} b
 * @returns {number}
 */
function parseRawByte(b) {
    return b & 0b01111111
}

/**
 * Returns true if 'b' is the last byte in the Plutus-core byte-list representation of an int.
 * @param {number} b
 * @returns {boolean}
 */
function rawByteIsLast(b) {
    return (b & 0b10000000) == 0
}

/**
 * Returns an unsigned (zigzag encoded) bigint
 * @param {BitReader} reader
 * @returns {bigint}
 */
export function decodeFlatInt(reader) {
    let bytes = []

    let b = reader.readByte()
    bytes.push(b)

    while (!rawByteIsLast(b)) {
        b = reader.readByte()
        bytes.push(b)
    }

    // strip the leading bit
    return decodeIntLE7(bytes.map((b) => parseRawByte(b))) // raw int is unsigned
}

/**
 * @param {BitWriter} bitWriter
 * @param {bigint} x positive number
 */
export function encodeFlatInt(bitWriter, x) {
    let bitString = padBits(x.toString(2), 7)

    // split every 7th
    let parts = []
    for (let i = 0; i < bitString.length; i += 7) {
        parts.push(bitString.slice(i, i + 7))
    }

    // reverse the parts
    parts.reverse()

    for (let i = 0; i < parts.length; i++) {
        if (i == parts.length - 1) {
            // last
            bitWriter.writeBits("0" + parts[i])
        } else {
            bitWriter.writeBits("1" + parts[i])
        }
    }
}
