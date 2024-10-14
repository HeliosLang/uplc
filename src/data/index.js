export {
    calcByteArrayMemSize,
    compareByteArrayData,
    makeByteArrayData
} from "./ByteArrayData.js"
export { makeConstrData } from "./ConstrData.js"
export { calcIntMemSize, makeIntData } from "./IntData.js"
export { makeListData } from "./ListData.js"
export { makeMapData } from "./MapData.js"

export { boolToUplcData, uplcDataToBool } from "./bool.js"
export { decodeUplcData } from "./decode.js"
export {
    unwrapUplcDataOption as unwrapUplcDataOption,
    wrapUplcDataOption
} from "./option.js"
export { realToUplcData, uplcDataToReal } from "./real.js"
export { stringToUplcData, uplcDataToString } from "./string.js"

/**
 * @typedef {import("./UplcData.js").ByteArrayData} ByteArrayData
 * @typedef {import("./UplcData.js").ConstrData} ConstrData
 * @typedef {import("./UplcData.js").IntData} IntData
 * @typedef {import("./UplcData.js").ListData} ListData
 * @typedef {import("./UplcData.js").MapData} MapData
 * @typedef {import("./UplcData.js").UplcData} UplcData
 */
