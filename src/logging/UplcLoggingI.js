export {} // so node.js knows this is a module

/**
 * @typedef {import("@helios-lang/compiler-utils").Site} Site
 */

/**
 * Gathers log messages produced by a Helios program
 * @typedef {{
 *   logPrint: (message: string, site?: Option<Site>) => void
 *   logError?: (message: string, stack?: Option<Site[]>) => void
 *   lastMsg: string
 *   logTrace?: Option<(message: string, site?: Option<Site>) => void>
 *   flush?: Option<() => void>
 *   reset? : Option<(reason: "build" | "validate") => void>
 * }} UplcLoggingI
 */
