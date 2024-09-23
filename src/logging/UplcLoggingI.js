export {} // so node.js knows this is a module
/**
 * Gathers log messages produced by a Helios program
 * @typedef {{
 *   logPrint: (message: string) => void
 *   logError?: (message: string) => void
 *   lastMsg: string
 *   logTrace?: Option<(message: string) => void>
 *   flush?: Option<() => void>
 *   reset? : Option<(reason: "build" | "validate") => void>
 * }} UplcLoggingI
 */
