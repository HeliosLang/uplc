export {}

/**
 * @typedef {import("../cek/CekTerm.js").CekTerm} CekTerm
 * @typedef {import("../flat/index.js").FlatWriterI} FlatWriterI
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * @typedef {CekTerm & {
 *   toFlat: (writer: FlatWriterI) => void
 *   children: UplcTerm[]
 * }} CommonUplcTermProps
 */

/**
 * @typedef {(
 *   UplcBuiltinI
 *   | UplcCallI
 *   | UplcConstI
 *   | UplcDelayI
 *   | UplcErrorI
 *   | UplcForceI
 *   | UplcLambdaI
 *   | UplcVarI
 * )} UplcTerm
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "builtin"
 *   id: number
 * }} UplcBuiltinI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "call"
 *   fn: UplcTerm
 *   arg: UplcTerm
 * }} UplcCallI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "const"
 *   flatSize: number
 *   serializableTerm: UplcTerm
 *   value: UplcValue
 * }} UplcConstI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "delay"
 *   arg: UplcTerm
 * }} UplcDelayI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "error"
 * }} UplcErrorI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "force"
 *   arg: UplcTerm
 * }} UplcForceI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "lambda"
 *   expr: UplcTerm
 *   argName: Option<string>
 * }} UplcLambdaI
 */

/**
 * @typedef {CommonUplcTermProps & {
 *   kind: "var"
 *   index: number
 *   name: Option<string>
 * }} UplcVarI
 */
