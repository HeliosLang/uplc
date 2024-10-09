import { byteToBits } from "@helios-lang/codec-utils"

/**
 * @typedef {import("./UplcValue.js").UplcTypeI} UplcTypeI
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */



// common type bits
const INT = "0000"
const BYTE_ARRAY = "0001"
const STRING = "0010"
const UNIT = "0011"
const BOOL = "0100"
const LIST = "0101"
const PAIR = "0110"
const CONTAINER = "0111"
const DATA = "1000"
const BLS12_381_G1_ELEMENT = "1001"
const BLS12_381_G2_ELEMENT = "1010"
const BLS12_381_ML_RESULT = "1011"

/**
 * Represents the typeBits of a UPLC primitive.
 * @implements {UplcTypeI}
 */
export class UplcType {
    /**
     * @private
     * @readonly
     * @type {string}
     */
    _typeBits

    /**
     * @param {string} typeBits
     */
    constructor(typeBits) {
        this._typeBits = typeBits
    }

    /**
     * @returns {UplcType}
     */
    static bls12_381_G1_element() {
        return new UplcType(BLS12_381_G1_ELEMENT)
    }

    /**
     * @returns {UplcType}
     */
    static bls12_381_G2_element() {
        return new UplcType(BLS12_381_G2_ELEMENT)
    }

    /**
     * @returns {UplcType}
     */
    static bls12_381_MlResult() {
        return new UplcType(BLS12_381_ML_RESULT)
    }

    /**
     * @returns {UplcType}
     */
    static bool() {
        return new UplcType(BOOL)
    }

    /**
     * @returns {UplcType}
     */
    static byteArray() {
        return new UplcType(BYTE_ARRAY)
    }

    /**
     * @returns {UplcType}
     */
    static data() {
        return new UplcType(DATA)
    }

    /**
     * @returns {UplcType}
     */
    static dataPair() {
        return UplcType.pair(UplcType.data(), UplcType.data())
    }

    /**
     * @returns {UplcType}
     */
    static int() {
        return new UplcType(INT)
    }

    /**
     * @param {UplcTypeI} itemType
     * @returns {UplcType}
     */
    static list(itemType) {
        return new UplcType([CONTAINER, LIST, itemType.typeBits].join("1"))
    }

    /**
     * @param {UplcTypeI} firstType
     * @param {UplcTypeI} secondType
     * @returns {UplcType}
     */
    static pair(firstType, secondType) {
        return new UplcType(
            [
                CONTAINER,
                CONTAINER,
                PAIR,
                firstType.typeBits,
                secondType.typeBits
            ].join("1")
        )
    }

    /**
     * @returns {UplcType}
     */
    static string() {
        return new UplcType(STRING)
    }

    /**
     * @returns {UplcType}
     */
    static unit() {
        return new UplcType(UNIT)
    }

    /**
     * @param {number[]} lst
     * @returns {UplcType}
     */
    static fromNumbers(lst) {
        return new UplcType(lst.map((x) => byteToBits(x, 4, false)).join("1"))
    }

    /**
     * @type {string}
     */
    get typeBits() {
        return this._typeBits
    }

    /**
     * @returns {boolean}
     */
    isData() {
        return this._typeBits == UplcType.data()._typeBits
    }

    /**
     * @returns {boolean}
     */
    isDataPair() {
        return this._typeBits == UplcType.dataPair()._typeBits
    }

    /**
     * @param {UplcTypeI} value
     * @returns {boolean}
     */
    isEqual(value) {
        return this._typeBits == value.typeBits
    }

    /**
     * @returns {string}
     */
    toString() {
        let typeBits = this._typeBits

        /**
         * @type {string[]}
         */
        const stack = []

        function popBits() {
            const b = typeBits.slice(0, 4)
            typeBits = typeBits.slice(5)
            return b
        }

        while (typeBits.length > 0) {
            let b = popBits()

            switch (b) {
                case INT:
                    stack.push("integer")
                    break
                case BYTE_ARRAY:
                    stack.push("bytestring")
                    break
                case STRING:
                    stack.push("string")
                    break
                case UNIT:
                    stack.push("unit")
                    break
                case BOOL:
                    stack.push("bool")
                    break
                case DATA:
                    stack.push("data")
                    break
                case BLS12_381_G1_ELEMENT:
                    stack.push("bls12_381_G1_element")
                    break
                case BLS12_381_G2_ELEMENT:
                    stack.push("bls12_381_G2_element")
                    break
                case BLS12_381_ML_RESULT:
                    stack.push("bls12_381_mlresult")
                    break
                case CONTAINER: {
                    b = popBits()

                    switch (b) {
                        case CONTAINER: {
                            b = popBits()

                            if (b != PAIR) {
                                throw new Error("invalid UplcType")
                            } else {
                                stack.push("pair")
                            }
                            break
                        }
                        case LIST:
                            stack.push("list")
                            break
                        default:
                            throw new Error(
                                `invalid UplcType ${this._typeBits}`
                            )
                    }
                    break
                }
                default:
                    throw new Error("invalid UplcType")
            }
        }

        /**
         * @param {string[]} stack
         * @returns {[string, string[]]}
         */
        function stackToString(stack) {
            const head = stack[0]
            const tail = stack.slice(1)

            switch (head) {
                case "integer":
                case "bytestring":
                case "string":
                case "unit":
                case "bool":
                case "data":
                case "bls12_381_G1_element":
                case "bls12_381_G2_element":
                case "bls12_381_mlresult":
                    return [head, tail]
                case "list": {
                    const [item, rest] = stackToString(tail)
                    return [`(list ${item})`, rest]
                }
                case "pair": {
                    const [first, rest1] = stackToString(tail)
                    const [second, rest2] = stackToString(rest1)

                    return [`(pair ${first} ${second})`, rest2]
                }
                default:
                    throw new Error(`unhandled UplcType ${head}`)
            }
        }

        const [result, rest] = stackToString(stack)

        if (rest.length != 0) {
            throw new Error("invalid UplcType")
        }

        return result
    }
}
