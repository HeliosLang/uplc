import { prepadBytes } from "@helios-lang/codec-utils"
import { G1, decodeG1Point, encodeG1Point } from "@helios-lang/crypto"
import { bytesFlatSize } from "../flat/index.js"
import { BLS12_381_G1_ELEMENT_TYPE } from "./UplcType.js"

/**
 * @typedef {import("@helios-lang/crypto").Point3<bigint>} Point3
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("./UplcValue.js").Bls12_381_G1_element} Bls12_381_G1_element
 * @typedef {import("./UplcValue.js").UplcType} UplcType
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @param {Point3 | {bytes: number[]}} args
 * @returns {Bls12_381_G1_element}
 */
export function makeBls12_381_G1_element(args) {
    if ("z" in args) {
        return new Bls12_381_G1_elementImpl(args)
    } else {
        const p = G1.fromAffine(decodeG1Point(prepadBytes(args.bytes, 48)))
        return new Bls12_381_G1_elementImpl(p)
    }
}

/**
 * @implements {Bls12_381_G1_elementImpl}
 */
class Bls12_381_G1_elementImpl {
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
     * @type {"bls12_381_G1_element"}
     */
    get kind() {
        return "bls12_381_G1_element"
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
        return BLS12_381_G1_ELEMENT_TYPE
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
            other.kind == "bls12_381_G1_element" &&
            G1.equals(this.point, other.point)
        )
    }

    /**
     * @param {FlatWriter} _writer
     */
    toFlat(_writer) {
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
