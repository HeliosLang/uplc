export { decodeFlatBytes, encodeFlatBytes, bytesFlatSize } from "./bytes.js"
export { decodeFlatInt, encodeFlatInt } from "./int.js"
export { FlatReader } from "./FlatReader.js"
export { FlatWriter } from "./FlatWriter.js"

/**
 * @template T
 * @typedef {import("./ValueReader.js").ValueReader<T>} ValueReader
 */

/**
 * @template TExpr
 * @template TValue
 * @typedef {import("./FlatReader.js").FlatReaderI<TExpr, TValue>} FlatReaderI
 */

/**
 * @typedef {import("./FlatWriter.js").FlatWriterI} FlatWriterI
 */
