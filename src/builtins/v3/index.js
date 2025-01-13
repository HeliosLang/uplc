import { addInteger } from "../v1/addInteger.js"
import { appendByteString } from "../v1/appendByteString.js"
import { appendStringV1 } from "../v1/appendString.js"
import { bData } from "../v1/bData.js"
import { blake2b_256 } from "../v1/blake2b_256.js"
import { chooseData } from "../v1/chooseData.js"
import { chooseList } from "../v1/chooseList.js"
import { chooseUnit } from "../v1/chooseUnit.js"
import { consByteString } from "../v1/consByteString.js"
import { constrData } from "../v1/constrData.js"
import { decodeUtf8 } from "../v1/decodeUtf8.js"
import { blake2b_224 } from "./blake2b_224.js"
import { bls12_381_G1_add } from "./bls12_381_G1_add.js"
import { bls12_381_G1_compress } from "./bls12_381_G1_compress.js"
import { bls12_381_G1_equal } from "./bls12_381_G1_equal.js"
import { bls12_381_G1_hashToGroup } from "./bls12_381_G1_hashToGroup.js"
import { bls12_381_G1_neg } from "./bls12_381_G1_neg.js"
import { bls12_381_G1_scalarMul } from "./bls12_381_G1_scalarMul.js"
import { bls12_381_G1_uncompress } from "./bls12_381_G1_uncompress.js"
import { bls12_381_G2_add } from "./bls12_381_G2_add.js"
import { bls12_381_G2_compress } from "./bls12_381_G2_compress.js"
import { bls12_381_G2_equal } from "./bls12_381_G2_equal.js"
import { bls12_381_G2_hashToGroup } from "./bls12_381_G2_hashToGroup.js"
import { bls12_381_G2_neg } from "./bls12_381_G2_neg.js"
import { bls12_381_G2_scalarMul } from "./bls12_381_G2_scalarMul.js"
import { bls12_381_G2_uncompress } from "./bls12_381_G2_uncompress.js"
import { bls12_381_finalVerify } from "./bls12_381_finalVerify.js"
import { bls12_381_millerLoop } from "./bls12_381_millerLoop.js"
import { bls12_381_mulMlResult } from "./bls12_381_mulMlResult.js"
import { byteStringToInteger } from "./byteStringToInteger.js"
import { divideInteger } from "./divideInteger.js"
import { encodeUtf8 } from "./encodeUtf8.js"
import { equalsByteString } from "./equalsByteString.js"
import { equalsData } from "./equalsData.js"
import { equalsInteger } from "./equalsInteger.js"
import { equalsString } from "./equalsString.js"
import { fstPair } from "./fstPair.js"
import { headList } from "./headList.js"
import { iData } from "./iData.js"
import { ifThenElse } from "./ifThenElse.js"
import { indexByteString } from "./indexByteString.js"
import { integerToByteString } from "./integerToByteString.js"
import { keccak_256 } from "./keccak_256.js"
import { lengthOfByteString } from "./lengthOfByteString.js"
import { lessThanByteString } from "./lessThanByteString.js"
import { lessThanEqualsByteString } from "./lessThanEqualsByteString.js"
import { lessThanEqualsInteger } from "./lessThanEqualsInteger.js"
import { lessThanInteger } from "./lessThanInteger.js"
import { listData } from "./listData.js"
import { mapData } from "./mapData.js"
import { mkCons } from "./mkCons.js"
import { mkNilData } from "./mkNilData.js"
import { mkNilPairData } from "./mkNilPairData.js"
import { mkPairData } from "./mkPairData.js"
import { modInteger } from "./modInteger.js"
import { multiplyInteger } from "./multiplyInteger.js"
import { nullList } from "./nullList.js"
import { quotientInteger } from "./quotientInteger.js"
import { remainderInteger } from "./remainderInteger.js"
import { serialiseData } from "./serialiseData.js"
import { sha2_256 } from "./sha2_256.js"
import { sha3_256 } from "./sha3_256.js"
import { sliceByteString } from "./sliceByteString.js"
import { sndPair } from "./sndPair.js"
import { subtractInteger } from "./subtractInteger.js"
import { tailList } from "./tailList.js"
import { trace } from "./trace.js"
import { unBData } from "./unBData.js"
import { unConstrData } from "./unConstrData.js"
import { unIData } from "./unIData.js"
import { unListData } from "./unListData.js"
import { unMapData } from "./unMapData.js"
import { verifyEcdsaSecp256k1Signature } from "./verifyEcdsaSecp256k1Signature.js"
import { verifyEd25519Signature } from "./verifyEd25519Signature.js"
import { verifySchnorrSecp256k1Signature } from "./verifySchnorrSecp256k1Signature.js"

/**
 * @import { Builtin } from "../../index.js"
 */

/**
 * @type {Builtin[]}
 */
export const builtinsV3 = [
    addInteger, // 0
    subtractInteger, // 1
    multiplyInteger, // 2
    divideInteger, // 3
    quotientInteger, // 4
    remainderInteger, // 5
    modInteger, // 6
    equalsInteger, // 7
    lessThanInteger, // 8
    lessThanEqualsInteger, // 9
    appendByteString, // 10
    consByteString, // 11
    sliceByteString, // 12
    lengthOfByteString, // 13
    indexByteString, // 14
    equalsByteString, // 15
    lessThanByteString, // 16
    lessThanEqualsByteString, // 17
    sha2_256, // 18
    sha3_256, // 19
    blake2b_256, // 20
    verifyEd25519Signature, // 21
    appendStringV1, // 22
    equalsString, // 23
    encodeUtf8, // 24
    decodeUtf8, // 25
    ifThenElse, // 26
    chooseUnit, // 27
    trace, // 28
    fstPair, // 29
    sndPair, // 30
    chooseList, // 31
    mkCons, // 32
    headList, // 33
    tailList, // 34
    nullList, // 35
    chooseData, // 36
    constrData, // 37
    mapData, // 38
    listData, // 39
    iData, // 40
    bData, // 41
    unConstrData, // 42
    unMapData, // 43
    unListData, // 44
    unIData, // 45
    unBData, // 46
    equalsData, // 47
    mkPairData, // 48
    mkNilData, // 49
    mkNilPairData, // 50
    serialiseData, // 51
    verifyEcdsaSecp256k1Signature, // 52
    verifySchnorrSecp256k1Signature, // 53
    bls12_381_G1_add, // 54
    bls12_381_G1_neg, // 55
    bls12_381_G1_scalarMul, // 56
    bls12_381_G1_equal, // 57
    bls12_381_G1_compress, // 58
    bls12_381_G1_uncompress, // 59
    bls12_381_G1_hashToGroup, // 60
    bls12_381_G2_add, // 61
    bls12_381_G2_neg, // 62
    bls12_381_G2_scalarMul, // 63
    bls12_381_G2_equal, // 64
    bls12_381_G2_compress, // 65
    bls12_381_G2_uncompress, // 66
    bls12_381_G2_hashToGroup, // 67
    bls12_381_millerLoop, // 68
    bls12_381_mulMlResult, // 69
    bls12_381_finalVerify, // 70
    keccak_256, // 71
    blake2b_224, // 72
    integerToByteString, // 73
    byteStringToInteger // 74
]

/**
 * @type {Map<string, Builtin>}
 */
export const builtinsV3Map = (() =>
    /* @__PURE__ */ new Map(
        /* @__PURE__ */ builtinsV3.map((bi) => [bi.name, bi])
    ))()
