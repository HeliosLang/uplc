/**
 * @typedef {import("./UplcLoggingI.js").UplcLoggingI} UplcLoggingI
 */

/**
 * @implements {UplcLoggingI}
 */
export class BasicUplcLogger {
    /**
     * @type {string}
     */
    lastMsg

    constructor() {
        this.lastMsg = ""
    }

    /**
     * emits a message from a Helios program
     * @param {string} msg
     * @returns {void}
     */
    logPrint(msg) {
        this.lastMsg = msg
        console.log(msg)
    }

    // reset() {}
}
