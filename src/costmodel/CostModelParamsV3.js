/**
 * @returns {number[]}
 */
export function DEFAULT_COST_MODEL_PARAMS_V3() {
    return CONWAY_COST_MODEL_PARAMS_V3
}

/**
 * @type {number[]}
 */
export const CONWAY_COST_MODEL_PARAMS_V3 = [
    100788, // 0: addInteger-cpu-arguments-intercept
    420, // 1: addInteger-cpu-arguments-slope
    1, // 2: addInteger-memory-arguments-intercept
    1, // 3: addInteger-memory-arguments-slope
    1000, // 4: appendByteString-cpu-arguments-intercept
    173, // 5: appendByteString-cpu-arguments-slope
    0, // 6: appendByteString-memory-arguments-intercept
    1, // 7: appendByteString-memory-arguments-slope
    1000, // 8: appendString-cpu-arguments-intercept
    59957, // 9: appendString-cpu-arguments-slope
    4, // 10: appendString-memory-arguments-intercept
    1, // 11: appendString-memory-arguments-slope
    11183, // 12: bData-cpu-arguments
    32, // 13: bData-memory-arguments
    201305, // 14: blake2b_256-cpu-arguments-intercept
    8356, // 15: blake2b_256-cpu-arguments-slope
    4, // 16: blake2b_256-memory-arguments
    16000, // 17: cekApplyCost-exBudgetCPU
    100, // 18: cekApplyCost-exBudgetMemory
    16000, // 19: cekBuiltinCost-exBudgetCPU
    100, // 20: cekBuiltinCost-exBudgetMemory
    16000, // 21: cekConstCost-exBudgetCPU
    100, // 22: cekConstCost-exBudgetMemory
    16000, // 23: cekDelayCost-exBudgetCPU
    100, // 24: cekDelayCost-exBudgetMemory
    16000, // 25: cekForceCost-exBudgetCPU
    100, // 26: cekForceCost-exBudgetMemory
    16000, // 27: cekLamCost-exBudgetCPU
    100, // 28: cekLamCost-exBudgetMemory
    100, // 29: cekStartupCost-exBudgetCPU
    100, // 30: cekStartupCost-exBudgetMemory
    16000, // 31: cekVarCost-exBudgetCPU
    100, // 32: cekVarCost-exBudgetMemory
    94375, // 33: chooseData-cpu-arguments
    32, // 34: chooseData-memory-arguments
    132994, // 35: chooseList-cpu-arguments
    32, // 36: chooseList-memory-arguments
    61462, // 37: chooseUnit-cpu-arguments
    4, // 38: chooseUnit-memory-arguments
    72010, // 39: consByteString-cpu-arguments-intercept
    178, // 40: consByteString-cpu-arguments-slope
    0, // 41: consByteString-memory-arguments-intercept
    1, // 42: consByteString-memory-arguments-slope
    22151, // 43: constrData-cpu-arguments
    32, // 44: constrData-memory-arguments
    91189, // 45: decodeUtf8-cpu-arguments-intercept
    769, // 46: decodeUtf8-cpu-arguments-slope
    4, // 47: decodeUtf8-memory-arguments-intercept
    2, // 48: decodeUtf8-memory-arguments-slope
    85848, // 49: divideInteger-cpu-arguments-constant
    123203, // 50: divideInteger-cpu-arguments-model-arguments-c00
    7305, // 51: divideInteger-cpu-arguments-model-arguments-c01
    -900, // 52: divideInteger-cpu-arguments-model-arguments-c02
    1716, // 53: divideInteger-cpu-arguments-model-arguments-c10
    549, // 54: divideInteger-cpu-arguments-model-arguments-c11
    57, // 55: divideInteger-cpu-arguments-model-arguments-c20
    85848, // 56: divideInteger-cpu-arguments-model-arguments-minimum
    0, // 57: divideInteger-memory-arguments-intercept
    1, // 58: divideInteger-memory-arguments-minimum
    1, // 59: divideInteger-memory-arguments-slope
    1000, // 60: encodeUtf8-cpu-arguments-intercept
    42921, // 61: encodeUtf8-cpu-arguments-slope
    4, // 62: encodeUtf8-memory-arguments-intercept
    2, // 63: encodeUtf8-memory-arguments-slope
    24548, // 64: equalsByteString-cpu-arguments-constant
    29498, // 65: equalsByteString-cpu-arguments-intercept
    38, // 66: equalsByteString-cpu-arguments-slope
    1, // 67: equalsByteString-memory-arguments
    898148, // 68: equalsData-cpu-arguments-intercept
    27279, // 69: equalsData-cpu-arguments-slope
    1, // 70: equalsData-memory-arguments
    51775, // 71: equalsInteger-cpu-arguments-intercept
    558, // 72: equalsInteger-cpu-arguments-slope
    1, // 73: equalsInteger-memory-arguments
    39184, // 74: equalsString-cpu-arguments-constant
    1000, // 75: equalsString-cpu-arguments-intercept
    60594, // 76: equalsString-cpu-arguments-slope
    1, // 77: equalsString-memory-arguments
    141895, // 78: fstPair-cpu-arguments
    32, // 79: fstPair-memory-arguments
    83150, // 80: headList-cpu-arguments
    32, // 81: headList-memory-arguments
    15299, // 82: iData-cpu-arguments
    32, // 83: iData-memory-arguments
    76049, // 84: ifThenElse-cpu-arguments
    1, // 85: ifThenElse-memory-arguments
    13169, // 86: indexByteString-cpu-arguments
    4, // 87: indexByteString-memory-arguments
    22100, // 88: lengthOfByteString-cpu-arguments
    10, // 89: lengthOfByteString-memory-arguments
    28999, // 90: lessThanByteString-cpu-arguments-intercept
    74, // 91: lessThanByteString-cpu-arguments-slope
    1, // 92: lessThanByteString-memory-arguments
    28999, // 93: lessThanEqualsByteString-cpu-arguments-intercept
    74, // 94: lessThanEqualsByteString-cpu-arguments-slope
    1, // 95: lessThanEqualsByteString-memory-arguments
    43285, // 96: lessThanEqualsInteger-cpu-arguments-intercept
    552, // 97: lessThanEqualsInteger-cpu-arguments-slope
    1, // 98: lessThanEqualsInteger-memory-arguments
    44749, // 99: lessThanInteger-cpu-arguments-intercept
    541, // 100: lessThanInteger-cpu-arguments-slope
    1, // 101: lessThanInteger-memory-arguments
    33852, // 102: listData-cpu-arguments
    32, // 103: listData-memory-arguments
    68246, // 104: mapData-cpu-arguments
    32, // 105: mapData-memory-arguments
    72362, // 106: mkCons-cpu-arguments
    32, // 107: mkCons-memory-arguments
    7243, // 108: mkNilData-cpu-arguments
    32, // 109: mkNilData-memory-arguments
    7391, // 110: mkNilPairData-cpu-arguments
    32, // 111: mkNilPairData-memory-arguments
    11546, // 112: mkPairData-cpu-arguments
    32, // 113: mkPairData-memory-arguments
    85848, // 114: modInteger-cpu-arguments-constant
    123203, // 115: modInteger-cpu-arguments-model-arguments-c00
    7305, // 116: modInteger-cpu-arguments-model-arguments-c01
    -900, // 117: modInteger-cpu-arguments-model-arguments-c02
    1716, // 118: modInteger-cpu-arguments-model-arguments-c10
    549, // 119: modInteger-cpu-arguments-model-arguments-c11
    57, // 120: modInteger-cpu-arguments-model-arguments-c20
    85848, // 121: modInteger-cpu-arguments-model-arguments-minimum
    0, // 122: modInteger-memory-arguments-intercept
    1, // 123: modInteger-memory-arguments-slope
    90434, // 124: multiplyInteger-cpu-arguments-intercept
    519, // 125: multiplyInteger-cpu-arguments-slope
    0, // 126: multiplyInteger-memory-arguments-intercept
    1, // 127: multiplyInteger-memory-arguments-slope
    74433, // 128: nullList-cpu-arguments
    32, // 129: nullList-memory-arguments
    85848, // 130: quotientInteger-cpu-arguments-constant
    123203, // 131: quotientInteger-cpu-arguments-model-arguments-c00
    7305, // 132: quotientInteger-cpu-arguments-model-arguments-c01
    -900, // 133: quotientInteger-cpu-arguments-model-arguments-c02
    1716, // 134: quotientInteger-cpu-arguments-model-arguments-c10
    549, // 135: quotientInteger-cpu-arguments-model-arguments-c11
    57, // 136: quotientInteger-cpu-arguments-model-arguments-c20
    85848, // 137: quotientInteger-cpu-arguments-model-arguments-minimum
    0, // 138: quotientInteger-memory-arguments-intercept
    1, // 139: quotientInteger-memory-arguments-minimum
    1, // 140: quotientInteger-memory-arguments-slope
    85848, // 141: remainderInteger-cpu-arguments-constant
    123203, // 142: remainderInteger-cpu-arguments-model-arguments-c00
    7305, // 143: remainderInteger-cpu-arguments-model-arguments-c01
    -900, // 144: remainderInteger-cpu-arguments-model-arguments-c02
    1716, // 145: remainderInteger-cpu-arguments-model-arguments-c10
    549, // 146: remainderInteger-cpu-arguments-model-arguments-c11
    57, // 147: remainderInteger-cpu-arguments-model-arguments-c20
    85848, // 148: remainderInteger-cpu-arguments-model-arguments-minimum
    0, // 149: remainderInteger-memory-arguments-intercept
    1, // 150: remainderInteger-memory-arguments-slope
    955506, // 151: serialiseData-cpu-arguments-intercept
    213312, // 152: serialiseData-cpu-arguments-slope
    0, // 153: serialiseData-memory-arguments-intercept
    2, // 154: serialiseData-memory-arguments-slope
    270652, // 155: sha2_256-cpu-arguments-intercept
    22588, // 156: sha2_256-cpu-arguments-slope
    4, // 157: sha2_256-memory-arguments
    1457325, // 158: sha3_256-cpu-arguments-intercept
    64566, // 159: sha3_256-cpu-arguments-slope
    4, // 160: sha3_256-memory-arguments
    20467, // 161: sliceByteString-cpu-arguments-intercept
    1, // 162: sliceByteString-cpu-arguments-slope
    4, // 163: sliceByteString-memory-arguments-intercept
    0, // 164: sliceByteString-memory-arguments-slope
    141992, // 165: sndPair-cpu-arguments
    32, // 166: sndPair-memory-arguments
    100788, // 167: subtractInteger-cpu-arguments-intercept
    420, // 168: subtractInteger-cpu-arguments-slope
    1, // 169: subtractInteger-memory-arguments-intercept
    1, // 170: subtractInteger-memory-arguments-slope
    81663, // 171: tailList-cpu-arguments
    32, // 172: tailList-memory-arguments
    59498, // 173: trace-cpu-arguments
    32, // 174: trace-memory-arguments
    20142, // 175: unBData-cpu-arguments
    32, // 176: unBData-memory-arguments
    24588, // 177: unConstrData-cpu-arguments
    32, // 178: unConstrData-memory-arguments
    20744, // 179: unIData-cpu-arguments
    32, // 180: unIData-memory-arguments
    25933, // 181: unListData-cpu-arguments
    32, // 182: unListData-memory-arguments
    24623, // 183: unMapData-cpu-arguments
    32, // 184: unMapData-memory-arguments
    43053543, // 185: verifyEcdsaSecp256k1Signature-cpu-arguments
    10, // 186: verifyEcdsaSecp256k1Signature-memory-arguments
    53384111, // 187: verifyEd25519Signature-cpu-arguments-intercept
    14333, // 188: verifyEd25519Signature-cpu-arguments-slope
    10, // 189: verifyEd25519Signature-memory-arguments
    43574283, // 190: verifySchnorrSecp256k1Signature-cpu-arguments-intercept
    26308, // 191: verifySchnorrSecp256k1Signature-cpu-arguments-slope
    10, // 192: verifySchnorrSecp256k1Signature-memory-arguments
    16000, // 193: cekConstrCost-exBudgetCPU
    100, // 194: cekConstrCost-exBudgetMemory
    16000, // 195: cekCaseCost-exBudgetCPU
    100, // 196: cekCaseCost-exBudgetMemory
    962335, // 197: bls12_381_G1_add-cpu-arguments
    18, // 198: bls12_381_G1_add-memory-arguments
    2780678, // 199: bls12_381_G1_compress-cpu-arguments
    6, // 200: bls12_381_G1_compress-memory-arguments
    442008, // 201: bls12_381_G1_equal-cpu-arguments
    1, // 202: bls12_381_G1_equal-memory-arguments
    52538055, // 203: bls12_381_G1_hashToGroup-cpu-arguments-intercept
    3756, // 204: bls12_381_G1_hashToGroup-cpu-arguments-slope
    18, // 205: bls12_381_G1_hashToGroup-memory-arguments
    267929, // 206: bls12_381_G1_neg-cpu-arguments
    18, // 207: bls12_381_G1_neg-memory-arguments
    76433006, // 208: bls12_381_G1_scalarMul-cpu-arguments-intercept
    8868, // 209: bls12_381_G1_scalarMul-cpu-arguments-slope
    18, // 210: bls12_381_G1_scalarMul-memory-arguments
    52948122, // 211: bls12_381_G1_uncompress-cpu-arguments
    18, // 212: bls12_381_G1_uncompress-memory-arguments
    1995836, // 213: bls12_381_G2_add-cpu-arguments
    36, // 214: bls12_381_G2_add-memory-arguments
    3227919, // 215: bls12_381_G2_compress-cpu-arguments
    12, // 216: bls12_381_G2_compress-memory-arguments
    901022, // 217: bls12_381_G2_equal-cpu-arguments
    1, // 218: bls12_381_G2_equal-memory-arguments
    166917843, // 219: bls12_381_G2_hashToGroup-cpu-arguments-intercept
    4307, // 220: bls12_381_G2_hashToGroup-cpu-arguments-slope
    36, // 221: bls12_381_G2_hashToGroup-memory-arguments
    284546, // 222: bls12_381_G2_neg-cpu-arguments
    36, // 223: bls12_381_G2_neg-memory-arguments
    158221314, // 224: bls12_381_G2_scalarMul-cpu-arguments-intercept
    26549, // 225: bls12_381_G2_scalarMul-cpu-arguments-slope
    36, // 226: bls12_381_G2_scalarMul-memory-arguments
    74698472, // 227: bls12_381_G2_uncompress-cpu-arguments
    36, // 228: bls12_381_G2_uncompress-memory-arguments
    333849714, // 229: bls12_381_finalVerify-cpu-arguments
    1, // 230: bls12_381_finalVerify-memory-arguments
    254006273, // 231: bls12_381_millerLoop-cpu-arguments
    72, // 232: bls12_381_millerLoop-memory-arguments
    2174038, // 233: bls12_381_mulMlResult-cpu-arguments
    72, // 234: bls12_381_mulMlResult-memory-arguments
    2261318, // 235: keccak_256-cpu-arguments-intercept
    64571, // 236: keccak_256-cpu-arguments-slope
    4, // 237: keccak_256-memory-arguments
    207616, // 238: blake2b_224-cpu-arguments-intercept
    8310, // 239: blake2b_224-cpu-arguments-slope
    4, // 240: blake2b_224-memory-arguments
    1293828, // 241: integerToByteString-cpu-arguments-c0
    28716, // 242: integerToByteString-cpu-arguments-c1
    63, // 243: integerToByteString-cpu-arguments-c2
    0, // 244: integerToByteString-memory-arguments-intercept
    1, // 245: integerToByteString-memory-arguments-slope
    1006041, // 246: byteStringToInteger-cpu-arguments-c0
    43623, // 247: byteStringToInteger-cpu-arguments-c1
    251, // 248: byteStringToInteger-cpu-arguments-c2
    0, // 249: byteStringToInteger-memory-arguments-intercept
    1 // 250: byteStringToInteger-memory-arguments-slope
]
