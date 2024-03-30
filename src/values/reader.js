import { FlatReader } from "../flat/index.js"
import { UplcBool } from "./UplcBool.js"
import { UplcByteArray } from "./UplcByteArray.js"
import { UplcDataValue } from "./UplcDataValue.js"
import { UplcInt } from "./UplcInt.js"
import { UplcList } from "./UplcList.js"
import { UplcPair } from "./UplcPair.js"
import { UplcString } from "./UplcString.js"
import { UplcType } from "./UplcType.js"
import { UplcUnit } from "./UplcUnit.js"

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
            return () => UplcInt.fromFlat(r, true)
        case 1: // bytearray
            return () => UplcByteArray.fromFlat(r)
        case 2: // utf8-string
            return () => UplcString.fromFlat(r)
        case 3:
            return () => new UplcUnit() // no reading needed
        case 4: // Bool
            return () => UplcBool.fromFlat(r)
        case 5:
        case 6:
            throw new Error("unexpected type tag without type application")
        case 7:
            const containerType = typeList.shift()

            if (containerType === undefined) {
                throw new Error("expected nested type for container")
            } else if (containerType == 5) {
                // typeList is consumed by the construct call, so make sure to read it before!
                const itemType = UplcType.fromNumbers(typeList)
                const itemReader = dispatchValueReader(r, typeList)

                return () => UplcList.fromFlat(r, itemType, itemReader)
            } else if (containerType == 7) {
                const nestedContainerType = typeList.shift()
                if (nestedContainerType == undefined) {
                    throw new Error("expected nested type for container")
                } else if (nestedContainerType == 6) {
                    // typeList is consumed by the construct call, so make sure to read it in correct order!
                    const leftReader = dispatchValueReader(r, typeList)
                    const rightReader = dispatchValueReader(r, typeList)
                    return () => new UplcPair(leftReader(), rightReader())
                } else {
                    throw new Error("unexpected nested container type tag")
                }
            } else {
                throw new Error("unexpected container type tag")
            }
        case 8:
            return () => UplcDataValue.fromFlat(r)
        default:
            throw new Error(`unhandled value type ${type.toString()}`)
    }
}
