/**
 * @import { BasicUplcLogger } from "src/index.js"
 */

/**
 * @param {{}} _args
 * @returns {BasicUplcLogger}
 */
export function makeBasicUplcLogger(_args = {}) {
    return new BasicUplcLoggerImpl()
}

/**
 * @implements {BasicUplcLogger}
 */
class BasicUplcLoggerImpl {
    /**
     * @type {string}
     */
    lastMessage

    constructor() {
        this.lastMessage = ""
    }

    /**
     * emits a message from a Helios program
     * @param {string} msg
     * @returns {void}
     */
    logPrint(msg) {
        this.lastMessage = msg
        console.log(msg)
    }

    // reset() {}
}
