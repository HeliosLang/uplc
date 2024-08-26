import { G1, decodeG1Point, encodeG1Point } from "@helios-lang/crypto"
import { FlatWriter, bytesFlatSize } from "../flat/index.js"
import { UplcType } from "./UplcType.js"
import { prepadBytes } from "@helios-lang/codec-utils"

/**
 * @typedef {import("@helios-lang/crypto").Point3<bigint>} Point3
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @implements {UplcValue}
 */
export class Bls12_381_G1_element {
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
     * @returns {Bls12_381_G1_element}
     */
    static uncompress(bytes) {
        const p = G1.fromAffine(decodeG1Point(prepadBytes(bytes, 48)))
        return new Bls12_381_G1_element(p)
    }

    /**
     * Though a G1_element can't be serialized, but the parent Const term can be converted to an Apply[Builtin(G1_uncompress), ByteString(48-bytes)]
     * Note: the parent Const term already returns 4
     * @type {number}
     */
    get flatSize() {
        return 4 + 7 + bytesFlatSize(48)
    }

    /**
     * 48 bytes per coordinate, so 144 bytes uncompressed, so 18 words (144/8)
     * @type {number}
     */
    get memSize() {
        return 18
    }

    /**
     * @type {UplcType}
     */
    get type() {
        return UplcType.bls12_381_G1_element()
    }

    /**
     * @returns {number[]} - 48 bytes long
     */
    compress() {
        return encodeG1Point(G1.toAffine(this.point))
    }

    /**
     * @param {UplcValue} other
     * @returns {boolean}
     */
    isEqual(other) {
        return (
            other instanceof Bls12_381_G1_element &&
            G1.equals(this.point, other.point)
        )
    }

    /**
     * @param {FlatWriter} writer
     */
    toFlat(writer) {
        throw new Error("can't be serialized")
    }

    /**
     * Returns compressed form ByteString
     * @returns {string}
     */
    toString() {
        return `Bls12_381_G1_element(${this.point.x}, ${this.point.y}, ${this.point.z})`
    }
}
