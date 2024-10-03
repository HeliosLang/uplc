import { None } from "@helios-lang/type-utils"
import { stringifyCekValue } from "./CekValue.js"

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

/**
 * So we can later add things like env function name, function values
 * @typedef {{
 *   site?: Option<Site>
 *   functionName?: string
 *   argument?: CekValue
 * }} CallSiteInfo
 */

/**
 * Adds a formatted `stack`
 * @param {string} message
 * @param {CallSiteInfo[]} callSites
 * @returns {Error}
 */
export function newUplcRuntimeError(message, callSites) {
    const err = new Error(message)

    const lines = []

    /**
     * @type {CekValue[]}
     */
    let argumentsWithoutSites = []

    /**
     * @type {Option<string>}
     */
    let parentFunctionName = None

    for (let cs of callSites) {
        if (cs.site) {
            const allArguments = argumentsWithoutSites
                .concat(cs.argument ? [cs.argument] : [])
                .filter((a) => !!a.name)
            const line = `at ${cs.site.toString()}${parentFunctionName ? `, in ${parentFunctionName}` : ""}${allArguments.length > 0 ? `with ${allArguments.map((a) => `${a.name}=${stringifyCekValue(a)}`).join(", ")}` : ""}`

            lines.push(line)
            argumentsWithoutSites = []
        } else if (cs.argument) {
            argumentsWithoutSites.push(cs.argument)
        }

        parentFunctionName = cs.functionName
    }

    err.stack = "  " + lines.reverse().join("\n  ")

    return err
}
