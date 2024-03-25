import { ByteStream } from "@helios-lang/codec-utils"
import { decodeBytes, encodeBytes, isBytes } from "@helios-lang/cbor"
import { blake2b } from "@helios-lang/crypto"
import { FlatWriter } from "../../flat/FlatWriter.js"
import { CekMachine } from "../cek/index.js"
import { UplcCall, UplcConst, UplcForce, UplcReader } from "../terms/index.js"

/**
 * @typedef {import("@helios-lang/codec-utils").ByteArrayLike} ByteArrayLike
 * @typedef {import("../terms/index.js").UplcTerm} UplcTerm
 * @typedef {import("../values/index.js").UplcValue} UplcValue
 */

export class UplcProgram {
    /**
     * @readonly
     * @type {UplcTerm}
     */
    expr

    /**
     * @param {UplcTerm} expr
     */
    constructor(expr) {
        this.expr = expr
    }

    /**
     * UPLC version, determines UPLC semantics and term types
     * Note: though it makes sense for the team maintaining the Plutus repo
     *   for this to be distinct version, each HFC combines a potentially
     *   new uplcVersion with a new script version, so from a client perspective
     *   it only makes sense to track a single version change
     *   (ie. Plutus V1 vs Plutus V2 vs Plutus V3)
     * @returns {string}
     */
    static get uplcVersion() {
        return "1.0.0"
    }

    /**
     * @param {number[]} bytes
     * @returns {UplcProgram}
     */
    static fromFlat(bytes) {
        const r = new UplcReader(bytes)

        const version = `${r.readInt()}.${r.readInt()}.${r.readInt()}`

        if (version != UplcProgram.uplcVersion) {
            throw new Error(
                `uplc version mismatch, expected ${UplcProgram.uplcVersion}, got ${version}`
            )
        }

        const term = r.readExpr()

        return new UplcProgram(term)
    }

    /**
     * @param {ByteArrayLike} bytes
     * @returns {UplcProgram}
     */
    static fromCbor(bytes) {
        const stream = ByteStream.from(bytes)

        if (!isBytes(stream)) {
            throw new Error("unexpected")
        }

        let scriptBytes = decodeBytes(stream)

        if (isBytes(scriptBytes)) {
            scriptBytes = decodeBytes(scriptBytes)
        }

        return UplcProgram.fromFlat(scriptBytes)
    }

    /**
     * Script version, determines the available builtins and the shape of the ScriptContext
     * @type {string}
     */
    get plutusVersion() {
        return "PlutusScriptV1"
    }

    /**
     * Script version tag, shorthand for the plutus version, used in (de)serialization
     */
    get plutusVersionTag() {
        return 1
    }

    /**
     * Wrap the top-level term with consecutive UplcCall (not exported) terms.
     *
     * Returns a new UplcProgram instance, leaving the original untouched.
     * @param {UplcValue[]} args
     * @returns {UplcProgram} - a new UplcProgram instance
     */
    apply(args) {
        let expr = this.expr

        for (let arg of args) {
            expr = new UplcCall(expr, new UplcConst(arg))
        }

        return new UplcProgram(expr)
    }

    /**
     * Throws an error if the result isn't a value (so error for any non-const term)
     * @param {undefined | UplcValue[]} args - if undefined, eval the root term without any applications, if empy: apply a force to the root term
     * @returns {UplcValue}
     */
    eval(args) {
        let expr = this.expr

        if (args) {
            if (args.length == 0) {
                expr = new UplcForce(expr)
            } else {
                for (let arg of args) {
                    expr = new UplcCall(expr, new UplcConst(arg))
                }
            }
        }

        const machine = new CekMachine(expr)

        return machine.eval()
    }

    /**
     * @returns {number[]} - 28 byte hash
     */
    hash() {
        let innerBytes = encodeBytes(this.toFlat())

        innerBytes.unshift(this.plutusVersionTag)

        // used for both script addresses and minting policy hashes
        return blake2b(innerBytes, 28)
    }

    /**
     * Returns the Cbor encoding of a script (flat bytes wrapped twice in Cbor bytearray).
     * TODO: investigate if the double envelope is still necessary
     * @returns {number[]}
     */
    toCbor() {
        return encodeBytes(encodeBytes(this.toFlat()))
    }

    /**
     * @returns {number[]}
     */
    toFlat() {
        const w = new FlatWriter()

        UplcProgram.uplcVersion.split(".").forEach((v) => w.writeInt(BigInt(v)))

        this.expr.toFlat(w)

        return w.finalize()
    }
}
