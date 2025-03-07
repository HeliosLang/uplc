import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { expectLeft, expectRight } from "@helios-lang/type-utils"
import { BABBAGE_COST_MODEL_PARAMS_V2 } from "../costmodel/index.js"
import { makeUplcBool, makeUplcInt } from "../values/index.js"
import {
    decodeUplcProgramV2FromCbor,
    parseUplcProgramV2
} from "./UplcProgramV2.js"

/**
 * @import { UplcValue } from "../index.js"
 */

const dummyArg = makeUplcInt(0)

describe("UplcProgramV2", () => {
    it("evaluates always_fails as error", () => {
        const { result } = decodeUplcProgramV2FromCbor(
            "581e581c01000033223232222350040071235002353003001498498480048005"
        ).eval([dummyArg, dummyArg, dummyArg])

        strictEqual(expectLeft(result).error, "")
    })

    it("evaluates always_succeeds as non-error", () => {
        const program = decodeUplcProgramV2FromCbor(
            "4e4d01000033222220051200120011"
        )

        const { result } = program.eval([dummyArg, dummyArg, dummyArg])

        strictEqual(typeof expectRight(result), "string")
    })

    it(`evaluates (program 1.0.0 (con bool false)) as UplcBool(false)`, () => {
        const program = parseUplcProgramV2("(program 1.0.0 (con bool False))")

        const { result } = program.eval(undefined)

        strictEqual(expectRight(result).toString(), "false")
    })
})

/**
 * Taken from: https://github.com/IntersectMBO/plutus/tree/master/plutus-conformance/test-cases/uplc/evaluation/
 * @type {{src: string, mem: bigint, cpu: bigint, result: string | UplcValue}[]}
 */
const conformanceTests = [
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a)] (con bytestring #)] (con bytestring #e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c)] (con bytestring #72)] (con bytestring #92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da085ac1e43e15996e458f3613d0f11d8c387b2eaeb4302aeeb00d291612bb0c00)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #fc51cd8e6218a1a38da47ed00230f0580816ed13ba3303ac5deb911548908025)] (con bytestring #af82)] (con bytestring #6291d657deec24024827e69c3abe01a30ce548a284743a445e3680d7db5ac3ac18ff9b538d16f290ae67f760984dc6594a7c15e9716ed28dc027beceea1ec40a)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e61a185bcef2613a6c7cb79763ce945d3b245d76114dd440bcf5f2dc1aa57057)] (con bytestring #cbc77b)] (con bytestring #d9868d52c2bebce5f3fa5a79891970f309cb6591e3e1702a70276fa97c24b3a8e58606c38c9758529da50ee31b8219cba45271c689afa60b0ea26c99db19b00c)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #6df9340c138cc188b5fe4464ebaa3f7fc206a2d55c3434707e74c9fc04e20ebb)] (con bytestring #5f4c8989)] (con bytestring #124f6fc6b0d100842769e71bd530664d888df8507df6c56dedfdb509aeb93416e26b918d38aa06305df3095697c18b2aa832eaa52edc0ae49fbae5a85e150c07)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(false)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #fbcfbfa40505d7f2be444a33d185cc54e16d615260e1640b2b5087b83ee3643d)] (con bytestring #89010d855972)] (con bytestring #6ed629fc1d9ce9e1468755ff636d5a3f40a5d9c91afd93b79d241830f7e5fa29854b8f20cc6eecbb248dbd8d16d14e99752194e4904d09c74d639518839d2300)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #98a5e3a36e67aaba89888bf093de1ad963e774013b3902bfab356d8b90178a63)] (con bytestring #b4a8f381e70e7a)] (con bytestring #6e0af2fe55ae377a6b7a7278edfb419bd321e06d0df5e27037db8812e7e3529810fa5552f6c0020985ca17a0e02e036d7b222a24f99b77b75fdd16cb05568107)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #f81fb54a825fced95eb033afcd64314075abfb0abd20a970892503436f34b863)] (con bytestring #4284abc51bb67235)] (con bytestring #d6addec5afb0528ac17bb178d3e7f2887f9adbb1ad16e110545ef3bc57f9de2314a5c8388f723b8907be0f3ac90c6259bbe885ecc17645df3db7d488f805fa08)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #c1a49c66e617f9ef5ec66bc4c6564ca33de2a5fb5e1464062e6d6c6219155efd)] (con bytestring #672bf8965d04bc5146)] (con bytestring #2c76a04af2391c147082e33faacdbe56642a1e134bd388620b852b901a6bc16ff6c9cc9404c41dea12ed281da067a1513866f9d964f8bdd24953856c50042901)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #31b2524b8348f7ab1dfafa675cc538e9a84e3fe5819e27c12ad8bbc1a36e4dff)] (con bytestring #33d7a786aded8c1bf691)] (con bytestring #28e4598c415ae9de01f03f9f3fab4e919e8bf537dd2b0cdf6e79b9e6559c9409d9151a4c40f083193937627c369488259e99da5a9f0a87497fa6696a5dd6ce08)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #44b57ee30cdb55829d0a5d4f046baef078f1e97a7f21b62d75f8e96ea139c35f)] (con bytestring #3486f68848a65a0eb5507d)] (con bytestring #77d389e599630d934076329583cd4105a649a9292abc44cd28c40000c8e2f5ac7660a81c85b72af8452d7d25c070861dae91601c7803d656531650dd4e5c4100)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #6fe83693d011d111131c4f3fbaaa40a9d3d76b30012ff73bb0e39ec27ab18257)] (con bytestring #5a8d9d0a22357e6655f9c785)] (con bytestring #0f9ad9793033a2fa06614b277d37381e6d94f65ac2a5a94558d09ed6ce922258c1a567952e863ac94297aec3c0d0c8ddf71084e504860bb6ba27449b55adc40e)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #a2eb8c0501e30bae0cf842d2bde8dec7386f6b7fc3981b8c57c9792bb94cf2dd)] (con bytestring #b87d3813e03f58cf19fd0b6395)] (con bytestring #d8bb64aad8c9955a115a793addd24f7f2b077648714f49c4694ec995b330d09d640df310f447fd7b6cb5c14f9fe9f490bcf8cfadbfd2169c8ac20d3b8af49a0c)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #cf3af898467a5b7a52d33d53bc037e2642a8da996903fc252217e9c033e2f291)] (con bytestring #55c7fa434f5ed8cdec2b7aeac173)] (con bytestring #6ee3fe81e23c60eb2312b2006b3b25e6838e02106623f844c44edb8dafd66ab0671087fd195df5b8f58a1d6e52af42908053d55c7321010092748795ef94cf06)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #fd2a565723163e29f53c9de3d5e8fbe36a7ab66e1439ec4eae9c0a604af291a5)] (con bytestring #0a688e79be24f866286d4646b5d81c)] (con bytestring #f68d04847e5b249737899c014d31c805c5007a62c0a10d50bb1538c5f35503951fbc1e08682f2cc0c92efe8f4985dec61dcbd54d4b94a22547d24451271c8b00)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #34e5a8508c4743746962c066e4badea2201b8ab484de5c4f94476ccd2143955b)] (con bytestring #c942fa7ac6b23ab7ff612fdc8e68ef39)] (con bytestring #2a3d27dc40d0a8127949a3b7f908b3688f63b7f14f651aacd715940bdbe27a0809aac142f47ab0e1e44fa490ba87ce5392f33a891539caf1ef4c367cae54500c)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #0445e456dacc7d5b0bbed23c8200cdb74bdcb03e4c7b73f0a2b9b46eac5d4372)] (con bytestring #7368724a5b0efb57d28d97622dbde725af)] (con bytestring #3653ccb21219202b8436fb41a32ba2618c4a133431e6e63463ceb3b6106c4d56e1d2ba165ba76eaad3dc39bffb130f1de3d8e6427db5b71938db4e272bc3e20b)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #74d29127f199d86a8676aec33b4ce3f225ccb191f52c191ccd1e8cca65213a6b)] (con bytestring #bd8e05033f3a8bcdcbf4beceb70901c82e31)] (con bytestring #fbe929d743a03c17910575492f3092ee2a2bf14a60a3fcacec74a58c7334510fc262db582791322d6c8c41f1700adb80027ecabc14270b703444ae3ee7623e0a)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #5b96dca497875bf9664c5e75facf3f9bc54bae913d66ca15ee85f1491ca24d2c)] (con bytestring #8171456f8b907189b1d779e26bc5afbb08c67a)] (con bytestring #73bca64e9dd0db88138eedfafcea8f5436cfb74bfb0e7733cf349baa0c49775c56d5934e1d38e36f39b7c5beb0a836510c45126f8ec4b6810519905b0ca07c09)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #1ca281938529896535a7714e3584085b86ef9fec723f42819fc8dd5d8c00817f)] (con bytestring #8ba6a4c9a15a244a9c26bb2a59b1026f21348b49)] (con bytestring #a1adc2bc6a2d980662677e7fdff6424de7dba50f5795ca90fdf3e96e256f3285cac71d3360482e993d0294ba4ec7440c61affdf35fe83e6e04263937db93f105)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #7fae45dd0a05971026d410bc497af5be7d0827a82a145c203f625dfcb8b03ba8)] (con bytestring #1d566a6232bbaab3e6d8804bb518a498ed0f904986)] (con bytestring #bb61cf84de61862207c6a455258bc4db4e15eea0317ff88718b882a06b5cf6ec6fd20c5a269e5d5c805bafbcc579e2590af414c7c227273c102a10070cdfe80f)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #48359b850d23f0715d94bb8bb75e7e14322eaf14f06f28a805403fbda002fc85)] (con bytestring #1b0afb0ac4ba9ab7b7172cddc9eb42bba1a64bce47d4)] (con bytestring #b6dcd09989dfbac54322a3ce87876e1d62134da998c79d24b50bd7a6a797d86a0e14dc9d7491d6c14a673c652cfbec9f962a38c945da3b2f0879d0b68a921300)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #fdb30673402faf1c8033714f3517e47cc0f91fe70cf3836d6c23636e3fd2287c)] (con bytestring #507c94c8820d2a5793cbf3442b3d71936f35fe3afef316)] (con bytestring #7ef66e5e86f2360848e0014e94880ae2920ad8a3185a46b35d1e07dea8fa8ae4f6b843ba174d99fa7986654a0891c12a794455669375bf92af4cc2770b579e0c)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #b1d39801892027d58a8c64335163195893bfc1b61dbeca3260497e1f30371107)] (con bytestring #d3d615a8472d9962bb70c5b5466a3d983a4811046e2a0ef5)] (con bytestring #836afa764d9c48aa4770a4388b654e97b3c16f082967febca27f2fc47ddfd9244b03cfc729698acf5109704346b60b230f255430089ddc56912399d1122de70a)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #d0c846f97fe28585c0ee159015d64c56311c886eddcc185d296dbb165d2625d6)] (con bytestring #6ada80b6fa84f7034920789e8536b82d5e4678059aed27f71c)] (con bytestring #16e462a29a6dd498685a3718b3eed00cc1598601ee47820486032d6b9acc9bf89f57684e08d8c0f05589cda2882a05dc4c63f9d0431d6552710812433003bc08)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #2bf32ba142ba4622d8f3e29ecd85eea07b9c47be9d64412c9b510b27dd218b23)] (con bytestring #82cb53c4d5a013bae5070759ec06c3c6955ab7a4050958ec328c)] (con bytestring #881f5b8c5a030df0f75b6634b070dd27bd1ee3c08738ae349338b3ee6469bbf9760b13578a237d5182535ede121283027a90b5f865d63a6537dca07b44049a0f)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #94d23d977c33e49e5e4992c68f25ec99a27c41ce6b91f2bfa0cd8292fe962835)] (con bytestring #a9a8cbb0ad585124e522abbfb40533bdd6f49347b55b18e8558cb0)] (con bytestring #3acd39bec8c3cd2b44299722b5850a0400c1443590fd4861d59aae7496acb3df73fc3fdf7969ae5f50ba47dddc435246e5fd376f6b891cd4c2caf5d614b6170c)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #9d084aa8b97a6b9bafa496dbc6f76f3306a116c9d917e681520a0f914369427e)] (con bytestring #5cb6f9aa59b80eca14f6a68fb40cf07b794e75171fba96262c1c6adc)] (con bytestring #f5875423781b66216cb5e8998de5d9ffc29d1d67107054ace3374503a9c3ef811577f269de81296744bd706f1ac478caf09b54cdf871b3f802bd57f9a6cb9101)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #16cee8a3f2631834c88b670897ff0b08ce90cc147b4593b3f1f403727f7e7ad5)] (con bytestring #32fe27994124202153b5c70d3813fdee9c2aa6e7dc743d4d535f1840a5)] (con bytestring #d834197c1a3080614e0a5fa0aaaa808824f21c38d692e6ffbd200f7dfb3c8f44402a7382180b98ad0afc8eec1a02acecf3cb7fde627b9f18111f260ab1db9a07)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    },
    {
        src: "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #23be323c562dfd71ce65f5bba56a74a3a6dfc36b573d2f94f635c7f9b4fd5a5b)] (con bytestring #bb3172795710fe00054d3b5dfef8a11623582da68bf8e46d72d27cece2aa)] (con bytestring #0f8fad1e6bde771b4f5420eac75c378bae6db5ac6650cd2bc210c1823b432b48e016b10595458ffab92f7a8989b293ceb8dfed6c243a2038fc06652aaaf16f02)])",
        mem: 810n,
        cpu: 58309847n,
        result: makeUplcBool(true)
    }
]

const runtimeErrorTests = [
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEd25519Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #04e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifyEcdsaSecp256k1Signature) (con bytestring #02e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f0101)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c0909)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c09)])",
    "(program 1.0.0 [[[(builtin verifySchnorrSecp256k1Signature) (con bytestring #e253af0766804b869bb1595be9765b534886bbaab8305bf50dbc7f899bfb5f01)] (con bytestring #18b6bec097)] (con bytestring #b2fc46ad47af464478c199e1f8be169f1be6327c7f9a0a6689371ca94caf04064a01b22aff1520abd58951341603faed768cf78ce97ae7b038abfe456aa17c)])"
]

describe(`"UplcProgramV2 conformance`, () => {
    conformanceTests.forEach(({ src, mem, cpu, result: expectedResult }) => {
        it(src, () => {
            const program = parseUplcProgramV2(src)

            const { result, cost } = program.eval(undefined, {
                costModelParams: BABBAGE_COST_MODEL_PARAMS_V2
            })

            const resultRight = expectRight(result)
            const expectedResultRight = expectedResult

            if (
                typeof resultRight == "string" ||
                typeof expectedResultRight == "string"
            ) {
                if (
                    typeof resultRight == "string" &&
                    typeof expectedResultRight == "string"
                ) {
                    strictEqual(resultRight, expectedResultRight)
                } else {
                    throw new Error("incomparable term")
                }
            } else {
                const isEqual = expectedResultRight.isEqual(resultRight)

                if (!isEqual) {
                    throw new Error(
                        `expected ${expectedResultRight.toString()}, got ${resultRight.toString()}`
                    )
                }
                strictEqual(isEqual, true)
            }

            strictEqual(mem, cost.mem)
            strictEqual(cpu, cost.cpu)
        })
    })

    runtimeErrorTests.forEach((s) => {
        it(`fails to run ${s}`, () => {
            const program = parseUplcProgramV2(s)

            const { result } = program.eval(undefined)
            throws(() => expectRight(result))
        })
    })
})
