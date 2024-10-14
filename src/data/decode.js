import {
    isConstr,
    isDefBytes,
    isIndefBytes,
    isList,
    isMap
} from "@helios-lang/cbor"
import { makeByteStream } from "@helios-lang/codec-utils"
import { decodeByteArrayData } from "./ByteArrayData.js"
import { decodeConstrData } from "./ConstrData.js"
import { decodeIntData } from "./IntData.js"
import { decodeMapData } from "./MapData.js"
import { decodeListData } from "./ListData.js"

/**
 * @typedef {import("@helios-lang/codec-utils").BytesLike} BytesLike
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */

/**
 * @param {BytesLike} bytes - in cbor format
 * @returns {UplcData}
 */
export function decodeUplcData(bytes) {
    const stream = makeByteStream({ bytes })

    if (isList(stream)) {
        return decodeListData(stream, decodeUplcData)
    } else if (isIndefBytes(stream)) {
        return decodeByteArrayData(stream)
    } else {
        if (isDefBytes(stream)) {
            return decodeByteArrayData(stream)
        } else if (isMap(stream)) {
            return decodeMapData(stream, decodeUplcData)
        } else if (isConstr(stream)) {
            return decodeConstrData(stream, decodeUplcData)
        } else {
            // int, must come last
            return decodeIntData(stream)
        }
    }
}
