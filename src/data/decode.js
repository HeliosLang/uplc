import {
    isList,
    isDefBytes,
    isIndefBytes,
    isMap,
    isConstr
} from "@helios-lang/cbor"
import { ListData } from "./ListData.js"
import { IntData } from "./IntData.js"
import { ByteStream } from "@helios-lang/codec-utils"
import { ByteArrayData } from "./ByteArrayData.js"
import { MapData } from "./MapData.js"
import { ConstrData } from "./ConstrData.js"

/**
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {string | number[] | ByteStream} bytes - in cbor format
 * @returns {UplcData}
 */
export function decodeUplcData(bytes) {
    const stream = ByteStream.from(bytes)

    if (isList(stream)) {
        return ListData.fromCbor(stream, decodeUplcData)
    } else if (isIndefBytes(stream)) {
        return ByteArrayData.fromCbor(stream)
    } else {
        if (isDefBytes(stream)) {
            return ByteArrayData.fromCbor(stream)
        } else if (isMap(stream)) {
            return MapData.fromCbor(stream, decodeUplcData)
        } else if (isConstr(stream)) {
            return ConstrData.fromCbor(stream, decodeUplcData)
        } else {
            // int, must come last
            return IntData.fromCbor(stream)
        }
    }
}
