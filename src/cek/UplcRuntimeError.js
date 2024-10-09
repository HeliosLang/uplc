import { None } from "@helios-lang/type-utils"
import { stringifyCekValue } from "./CekValue.js"

/**
 * @typedef {import("./CallSiteInfo.js").CallSiteInfo} CallSiteInfo
 * @typedef {import("./CekValue.js").CekValue} CekValue
 */

export class UplcRuntimeError extends Error {
    /**
     * @readonly
     * @type {CallSiteInfo[]}
     */
    frames

    /**
     * @param {string} message
     * @param {CallSiteInfo[]} callSites
     */
    constructor(message, callSites = []) {
        super(message)

        this.frames = callSites

        Object.defineProperty(this, "frames", {
            enumerable: false,
            writable: true,
            configurable: false
        })

        UplcRuntimeError.prepareHeliosStackTrace(this, callSites)
    }

    /**
     * Mutates the `err.stack` field
     * @private
     * @param {UplcRuntimeError} err
     * @param {CallSiteInfo[]} callSites
     */
    static prepareHeliosStackTrace(err, callSites) {
        if (callSites.length == 0) {
            return
        }

        const jsStackLines = err.stack?.split("\n") ?? []

        // firefox is sadly different from chrome/node and requires each stack trace line to be formatted in a special way
        const isFirefox = jsStackLines?.[0]?.includes("@") // TODO: better regexp
        const stackIncludesMessage =
            jsStackLines?.[0] == `Error: ${err.message}` // TODO: better regexp
        const indent = isFirefox
            ? ""
            : stackIncludesMessage
              ? /^\s*/.exec(jsStackLines?.[1] ?? "")
              : (jsStackLines?.[0] ?? "")

        const lines = []

        /**
         * @type {CekValue[]}
         */
        let unhandledArgs = []

        /**
         * @type {Option<string>}
         */
        let parentFunctionName = None

        for (let cs of callSites) {
            if (cs.site) {
                const allArguments = unhandledArgs.filter((a) => !!a.name)

                const sitePart = [`${cs.site.toString()}`]
                const varsPart =
                    allArguments.length > 0
                        ? [
                              `[${allArguments.map((a) => `${a.name}=${stringifyCekValue(a)}`).join(", ")}]`
                          ]
                        : []
                const atPart = parentFunctionName
                    ? [`at ${parentFunctionName}`]
                    : [`at <anonymous>`]

                if (isFirefox) {
                    lines.push(
                        `<helios>@${atPart.concat(varsPart).concat(sitePart).join(", ")}:0`
                    )
                } else {
                    const fileNameHasExt =
                        cs.site.file.endsWith(".hl") ||
                        cs.site.file.endsWith(".helios")
                    lines.push(
                        indent +
                            atPart
                                .concat(
                                    [fileNameHasExt ? "(" : "(helios:"]
                                        .concat(sitePart)
                                        .concat([")"])
                                        .join("")
                                )
                                .concat(varsPart)
                                .join(" ")
                    )
                }

                unhandledArgs = cs.arguments ? cs.arguments.slice() : [] // argument is only relevant to the next call
            } else if (cs.arguments) {
                unhandledArgs = unhandledArgs.concat(cs.arguments)
            }

            parentFunctionName = cs.functionName
        }

        lines.reverse()

        // the advantage of using a class instead of a function to generate this instance is that there is no stack frame included for constructor call, so we can include all the js stack frames
        if (stackIncludesMessage) {
            err.stack = [jsStackLines[0]]
                .concat(lines)
                .concat(jsStackLines.slice(1))
                .join("\n")
        } else {
            err.stack = lines.concat(jsStackLines.slice(0)).join("\n")
        }
    }
}
