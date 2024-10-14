import { decodeUplcBoolFromFlat } from "./UplcBool.js"
import { decodeUplcByteArrayFromFlat } from "./UplcByteArray.js"
import { decodeUplcDataValueFromFlat } from "./UplcDataValue.js"
import { decodeUplcIntFromFlat } from "./UplcInt.js"
import { decodeUplcListFromFlat } from "./UplcList.js"
import { makeUplcPair } from "./UplcPair.js"
import { decodeUplcStringFromFlat } from "./UplcString.js"
import { makeUplcType } from "./UplcType.js"
import { UNIT_VALUE } from "./UplcUnit.js"

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("../flat/index.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @template T
 * @typedef {import("../flat/index.js").ValueReader<T>} ValueReader
 */

/**
 * @typedef {import("./UplcValue.js").UplcValue} UplcValue
 */

/**
 * @param {FlatReader<any, UplcValue>} r
 * @param {number[]} typeList
 * @returns {ValueReader<UplcValue>}
 */
export function dispatchValueReader(r, typeList) {
    const type = typeList.shift()

    if (type === undefined) {
        throw new Error("empty type list")
    }

    switch (type) {
        case 0: // signed Integer
            return () => decodeUplcIntFromFlat(r, true)
        case 1: // bytearray
            return () => decodeUplcByteArrayFromFlat(r)
        case 2: // utf8-string
            return () => decodeUplcStringFromFlat(r)
        case 3:
            return () => UNIT_VALUE // no reading needed
        case 4: // Bool
            return () => decodeUplcBoolFromFlat(r)
        case 5:
        case 6:
            throw new Error("unexpected type tag without type application")
        case 7:
            const containerType = typeList.shift()

            if (containerType === undefined) {
                throw new Error("expected nested type for container")
            } else if (containerType == 5) {
                // typeList is consumed by the construct call, so make sure to read it before!
                const itemType = makeUplcType({ numbers: typeList })
                const itemReader = dispatchValueReader(r, typeList)

                return () => decodeUplcListFromFlat(r, itemType, itemReader)
            } else if (containerType == 7) {
                const nestedContainerType = typeList.shift()
                if (nestedContainerType == undefined) {
                    throw new Error("expected nested type for container")
                } else if (nestedContainerType == 6) {
                    // typeList is consumed by the construct call, so make sure to read it in correct order!
                    const leftReader = dispatchValueReader(r, typeList)
                    const rightReader = dispatchValueReader(r, typeList)
                    return () =>
                        makeUplcPair({
                            first: leftReader(),
                            second: rightReader()
                        })
                } else {
                    throw new Error("unexpected nested container type tag")
                }
            } else {
                throw new Error("unexpected container type tag")
            }
        case 8:
            return () => decodeUplcDataValueFromFlat(r)
        case 9:
            throw new Error(`Bls12_381_G1_element can't be deserialized`)
        case 10:
            throw new Error(`Bls12_381_G2_element can't be deserialized`)
        case 11:
            throw new Error(`Bls12_381_MlResult can't be deserialized`)
        default:
            throw new Error(`unhandled value type ${type.toString()}`)
    }
}
