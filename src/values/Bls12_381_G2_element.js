import { G2, decodeG2Point, encodeG2Point } from "@helios-lang/crypto"
import { FlatWriter, bytesFlatSize } from "../flat/index.js"
import { UplcType } from "./UplcType.js"
import { prepadBytes } from "@helios-lang/codec-utils"

/**
 * @typedef {import("@helios-lang/crypto").Point3<[bigint, bigint]>} Point3
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @implements {UplcValue}
 */
export class Bls12_381_G2_element {
    /**
     * @readonly
     * @type {Point3}
     */
    point

    /**
     * @param {Point3} point
     */
    constructor(point) {
        this.point = point
    }

    /**
     * @param {number[]} bytes
     * @returns {Bls12_381_G2_element}
     */
    static uncompress(bytes) {
        const p = G2.fromAffine(decodeG2Point(prepadBytes(bytes, 96)))
        return new Bls12_381_G2_element(p)
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
        return UplcType.bls12_381_G2_element()
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
            other instanceof Bls12_381_G2_element &&
            G2.equals(this.point, other.point)
        )
    }

    /**
     * Throws an error, serialization can only be done using data and the uncompress function
     * @param {FlatWriter} writer
     */
    toFlat(writer) {
        throw new Error("can't be serialized")
    }

    /**
     * @returns {string}
     */
    toString() {
        return `Bls12_381_G2_element(${this.point.x}, ${this.point.y}, ${this.point.z})`
    }
}
