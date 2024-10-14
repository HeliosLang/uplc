import { padBits } from "@helios-lang/codec-utils"

/**
 * @typedef {import("@helios-lang/codec-utils").BitReader} BitReader
 * @typedef {import("@helios-lang/codec-utils").BitWriter} BitWriter
 */

/**
 * @param {BitReader} reader
 * @returns {number[]}
 */
export function decodeFlatBytes(reader) {
    reader.moveToByteBoundary(true)

    let bytes = []

    let nChunk = reader.readByte()

    while (nChunk > 0) {
        for (let i = 0; i < nChunk; i++) {
            bytes.push(reader.readByte())
        }

        nChunk = reader.readByte()
    }

    return bytes
}

/**
 * Write a list of bytes to the bitWriter using flat encoding.
 * Used by UplcString, UplcByteArray and UplcDataValue
 * Equivalent to E_B* function in Plutus-core docs
 * @param {BitWriter} writer
 * @param {number[]} bytes
 * @param {boolean} pad
 */
export function encodeFlatBytes(writer, bytes, pad = true) {
    if (pad) {
        writer.padToByteBoundary(true)
    }

    // the rest of this function is equivalent to E_C* function in Plutus-core docs
    let n = bytes.length
    let pos = 0

    // write chunks of 255
    while (pos < n) {
        // each iteration is equivalent to E_C function in Plutus-core docs

        let nChunk = Math.min(n - pos, 255)

        // equivalent to E_8 function in Plutus-core docs
        writer.writeBits(padBits(nChunk.toString(2), 8))

        for (let i = pos; i < pos + nChunk; i++) {
            let b = bytes[i]

            // equivalent to E_8 function in Plutus-core docs
            writer.writeBits(padBits(b.toString(2), 8))
        }

        pos += nChunk
    }

    if (pad) {
        writer.writeBits("00000000")
    }
}

/**
 * Includes type bits
 * @param {number} n
 * @returns {number}
 */
export function bytesFlatSize(n) {
    return 4 + n * 8 + Math.ceil(n / 256) * 8 + 8
}
