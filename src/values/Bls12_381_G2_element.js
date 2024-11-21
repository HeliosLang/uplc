import { prepadBytes } from "@helios-lang/codec-utils"
import { G2, decodeG2Point, encodeG2Point } from "@helios-lang/crypto"
import { bytesFlatSize } from "../flat/index.js"
import { BLS12_381_G2_ELEMENT_TYPE } from "./UplcType.js"

/**
 * @import { Point3 } from "@helios-lang/crypto"
 * @import { Bls12_381_G2_element, FlatWriter, UplcType, UplcValue } from "../index.js"
 */

/**
 * @param {Point3<[bigint, bigint]> | {bytes: number[]}} args
 * @returns {Bls12_381_G2_element}
 */
export function makeBls12_381_G2_element(args) {
    if ("z" in args) {
        return new Bls12_381_G2_elementImpl(args)
    } else {
        const p = G2.fromAffine(decodeG2Point(prepadBytes(args.bytes, 96)))
        return new Bls12_381_G2_elementImpl(p)
    }
}

/**
 * @implements {Bls12_381_G2_element}
 */
class Bls12_381_G2_elementImpl {
    /**
     * @readonly
     * @type {Point3<[bigint, bigint]>}
     */
    point

    /**
     * @param {Point3<[bigint, bigint]>} point
     */
    constructor(point) {
        this.point = point
    }

    /**
     * @type {"bls12_381_G2_element"}
     */
    get kind() {
        return "bls12_381_G2_element"
    }

    /**
     * Though a G2_element can't be serialized, but the parent Const term can be converted to an Apply[Builtin(G2_uncompress), ByteString(96-bytes)]
     * Note: the parent Const term already returns 4
     * @type {number}
     */
    get flatSize() {
        return 4 + 7 + bytesFlatSize(96)
    }

    /**
     * Double that of G1_element, 96 bytes per coordinate, 288 for uncompressed Point3, 36 words
     * @type {number}
     */
    get memSize() {
        return 36
    }

    /**
     * @type {UplcType}
     */
    get type() {
        return BLS12_381_G2_ELEMENT_TYPE
    }

    /**
     * @returns {number[]} - 96 bytes long
     */
    compress() {
        return encodeG2Point(G2.toAffine(this.point))
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            other.kind == "bls12_381_G2_element" &&
            G2.equals(this.point, other.point)
        )
    }

    /**
     * Throws an error, serialization can only be done using data and the uncompress function
     * @param {FlatWriter} _writer
     */
    toFlat(_writer) {
        throw new Error("can't be serialized")
    }

    /**
     * @returns {string}
     */
    toString() {
        return `Bls12_381_G2_element(${this.point.x}, ${this.point.y}, ${this.point.z})`
    }
}
