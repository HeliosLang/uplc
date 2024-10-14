export { decodeFlatBytes, encodeFlatBytes, bytesFlatSize } from "./bytes.js"
export { decodeFlatInt, encodeFlatInt } from "./int.js"
export { makeFlatReader } from "./FlatReader.js"
export { makeFlatWriter } from "./FlatWriter.js"

/**
 * @template T
 * @typedef {import("./ValueReader.js").ValueReader<T>} ValueReader
 */

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("./FlatReader.js").FlatReader<TExpr, TValue>} FlatReader
 */

/**
 * @typedef {import("./FlatWriter.js").FlatWriter} FlatWriter
 */
