import { byteToBits } from "@helios-lang/codec-utils"

/**
 * @import { UplcType, UplcValue } from "../index.js"
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
 * @param {{typeBits: string} | {numbers: number[]}} args
 * @returns {UplcType}
 */
export function makeUplcType(args) {
    if ("typeBits" in args) {
        return new UplcTypeImpl(args.typeBits)
    } else {
        return new UplcTypeImpl(
            args.numbers.map((x) => byteToBits(x, 4, false)).join("1")
        )
    }
}

/**
 * @overload
 * @param {UplcType} itemType
 * @returns {UplcType}
 */
/**
 * @overload
 * @param {{item: UplcType}} args
 * @returns {UplcType}
 */
/**
 * @param {([UplcType] | [{item: UplcType}])} args
 * @returns {UplcType}
 */
export function makeListType(...args) {
    const arg = args[0]

    return new UplcTypeImpl(
        [
            CONTAINER,
            LIST,
            "item" in arg ? arg.item.typeBits : arg.typeBits
        ].join("1")
    )
}

/**
 * @overload
 * @param {UplcType} first
 * @param {UplcType} second
 * @returns {UplcType}
 */
/**
 * @overload
 * @param {{first: UplcType, second: UplcType}} args
 * @returns {UplcType}
 */
/**
 * @param {([UplcType, UplcType] | [{first: UplcType, second: UplcType}])} args
 * @returns {UplcType}
 */
export function makePairType(...args) {
    /**
     * @type {UplcType}
     */
    let first

    /**
     * @type {UplcType}
     */
    let second
    if (args.length == 2) {
        first = args[0]
        second = args[1]
    } else {
        first = args[0].first
        second = args[0].second
    }

    return new UplcTypeImpl(
        [CONTAINER, CONTAINER, PAIR, first.typeBits, second.typeBits].join("1")
    )
}

/**
 * Represents the typeBits of a UPLC primitive.
 * @implements {UplcType}
 */
class UplcTypeImpl {
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
     * @type {string}
     */
    get typeBits() {
        return this._typeBits
    }

    /**
     * @returns {boolean}
     */
    isData() {
        return this._typeBits == DATA
    }

    /**
     * @returns {boolean}
     */
    isDataPair() {
        return this._typeBits == DATA_PAIR_TYPE.typeBits
    }

    /**
     * @param {UplcType} value
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

export const INT_TYPE = /* @__PURE__ */ makeUplcType({ typeBits: INT })
export const BYTE_ARRAY_TYPE = /* @__PURE__ */ makeUplcType({
    typeBits: BYTE_ARRAY
})
export const STRING_TYPE = /* @__PURE__ */ makeUplcType({ typeBits: STRING })
export const UNIT_TYPE = /* @__PURE__ */ makeUplcType({ typeBits: UNIT })
export const BOOL_TYPE = /* @__PURE__ */ makeUplcType({ typeBits: BOOL })
export const DATA_TYPE = /* @__PURE__ */ makeUplcType({ typeBits: DATA })
export const DATA_PAIR_TYPE = /* @__PURE__ */ makePairType({
    first: DATA_TYPE,
    second: DATA_TYPE
})
export const BLS12_381_G1_ELEMENT_TYPE = /* @__PURE__ */ makeUplcType({
    typeBits: BLS12_381_G1_ELEMENT
})
export const BLS12_381_G2_ELEMENT_TYPE = /* @__PURE__ */ makeUplcType({
    typeBits: BLS12_381_G2_ELEMENT
})
export const BLS12_381_ML_RESULT_TYPE = /* @__PURE__ */ makeUplcType({
    typeBits: BLS12_381_ML_RESULT
})
