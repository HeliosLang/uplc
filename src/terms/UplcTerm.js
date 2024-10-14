export {}

/**
 * @typedef {import("../cek/CekTerm.js").CekTerm} CekTerm
 * @typedef {import("../flat/index.js").FlatWriter} FlatWriter
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriter) => void
 *   children: UplcTerm[]
 * }} CommonUplcTermProps
 */

/**
 * @typedef {(
 *   UplcBuiltin
 *   | UplcCall
 *   | UplcConst
 *   | UplcDelay
 *   | UplcError
 *   | UplcForce
 *   | UplcLambda
 *   | UplcVar
 * )} UplcTerm
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "builtin"
 *   id: number
 * }} UplcBuiltin
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "call"
 *   fn: UplcTerm
 *   arg: UplcTerm
 * }} UplcCall
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "const"
 *   flatSize: number
 *   serializableTerm: UplcTerm
 *   value: UplcValue
 * }} UplcConst
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "delay"
 *   arg: UplcTerm
 * }} UplcDelay
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "error"
 * }} UplcError
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "force"
 *   arg: UplcTerm
 * }} UplcForce
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "lambda"
 *   expr: UplcTerm
 *   argName: Option<string>
 * }} UplcLambda
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "var"
 *   index: number
 *   name: Option<string>
 * }} UplcVar
 */
