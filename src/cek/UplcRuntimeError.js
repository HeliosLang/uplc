import { stringifyCekValue } from "./CekValue.js"

/**
 * @import { CallSiteInfo, CekValue, UplcData, UplcRuntimeError } from "../index.js"
 */

/**
 *
 * @param {string} message
 * @param {CallSiteInfo[]} callSites
 * @param {UplcData | undefined} [scriptContext]
 * @returns {UplcRuntimeError}
 */
export function makeUplcRuntimeError(
    message,
    callSites,
    scriptContext = undefined
) {
    return new UplcRuntimeErrorImpl(message, callSites, scriptContext)
}

/**
 * @param {unknown} x
 * @returns {x is UplcRuntimeError}
 */
export function isUplcRuntimeError(x) {
    if (x instanceof Error) {
        if (x instanceof UplcRuntimeErrorImpl) {
            return true
        }

        return "frames" in x && Array.isArray(x.frames)
    } else {
        return false
    }
}

/**
 * @implements {UplcRuntimeError}
 */
class UplcRuntimeErrorImpl extends Error {
    /**
     * Optional field indicating a ScriptContext (UPLC) in which the error occurred
     * @readonly
     * @type {UplcData | undefined}
     */
    scriptContext

    /**
     * private field so that it doesn't show up when the error isn't caught (i.e. not enumerable)
     * @readonly
     * @type {CallSiteInfo[]}
     */
    frames

    /**
     * @param {string} message
     * @param {CallSiteInfo[]} callSites
     * @param {UplcData} [scriptContext]
     */
    constructor(message, callSites = [], scriptContext) {
        super(message)

        this.frames = callSites

        Object.defineProperty(this, "frames", {
            enumerable: false,
            writable: true,
            configurable: false
        })
        Object.defineProperty(this, "scriptContext", {
            enumerable: false,
            writable: true,
            configurable: false
        })
        this.scriptContext = scriptContext

        prepareHeliosStackTrace(this, callSites)
    }

    /**
     * @type {"UplcRuntimeError"}
     */
    get name() {
        return "UplcRuntimeError"
    }
}

/**
 * Mutates the `err.stack` field
 * @param {UplcRuntimeError} err
 * @param {CallSiteInfo[]} callSites
 */
function prepareHeliosStackTrace(err, callSites) {
    if (callSites.length == 0) {
        return
    }

    const jsStackLines = (err.stack?.split("\n") ?? []).filter(
        (l) => !l.includes("at makeUplcRuntimeError")
    )

    // firefox is sadly different from chrome/node and requires each stack trace line to be formatted in a special way
    const isFirefox = jsStackLines?.[0]?.includes("@") // TODO: better regexp
    const stackIncludesMessage =
        jsStackLines?.[0] ==
        `UplcRuntimeError${err.message == "" ? "" : ": " + err.message}` // TODO: better regexp

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
     * @type {string | undefined}
     */
    let parentFunctionName = undefined

    for (let cs of callSites) {
        if (cs.site) {
            const allArguments = unhandledArgs.filter(
                (a) => !!a.name && !a.name.startsWith("__")
            )

            const sitePart = [`${cs.site.toString()}`]
            const varsPart =
                allArguments.length > 0
                    ? [
                          `[${allArguments.map((a) => `${a.name}=${stringifyCekValue(a, true)}`).join(", ")}]`
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

    if (stackIncludesMessage) {
        err.stack = [jsStackLines[0]]
            .concat(lines)
            .concat(jsStackLines.slice(1))
            .join("\n")
    } else {
        err.stack = lines.concat(jsStackLines.slice(0)).join("\n")
    }
}
