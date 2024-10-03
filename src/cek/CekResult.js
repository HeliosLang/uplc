/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("../costmodel/index.js").Cost} Cost
 * @typedef {import("../costmodel/index.js").CostBreakdown} CostBreakdown
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 * @typedef {import("./CallSiteInfo.js").CallSiteInfo} CallSiteInfo
 */

/**
 * Return value is optional and can be omitted if the UplcValue doesn't suffice to contain it (eg. lambda functions)
 * @typedef {{
 *   result: Either<
 *     {
 *       error: string
 *       callSites: CallSiteInfo[]
 *     },
 *     string | UplcValue
 *   >
 *   cost: Cost
 *   logs: {message: string, site?: Site}[]
 *   breakdown: CostBreakdown
 * }} CekResult
 */
