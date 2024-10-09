import {
    isConstr,
    isDefBytes,
    isIndefBytes,
    isList,
    isMap
} from "@helios-lang/cbor"
import { ByteStream } from "@helios-lang/codec-utils"
import { ByteArrayData } from "./ByteArrayData.js"
import { ConstrData } from "./ConstrData.js"
import { IntData } from "./IntData.js"
import { MapData } from "./MapData.js"
import { ListData } from "./ListData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {BytesLike} bytes - in cbor format
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
