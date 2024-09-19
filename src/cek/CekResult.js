/**
 * @typedef {import("@helios-lang/compiler-utils").UplcLoggingI} UplcLoggingI
 * @typedef {import("../costmodel/index.js").Cost} Cost
 * @typedef {import("../costmodel/index.js").CostBreakdown} CostBreakdown
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

/**
 * Return value is optional and can be omitted if the UplcValue doesn't suffice to contain it (eg. lambda functions)
 * @typedef {{
 *   result: Either<{error: string}, string | UplcValue>
 *   cost: Cost
 *   breakdown: CostBreakdown
 *   diagnostics?: UplcLoggingI  // not needed if always passed into CekMachine
 * }} CekResult
 */
