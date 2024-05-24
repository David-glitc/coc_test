import { Sdk } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";
import { NFT_config } from "./config.js";
import { readFileSync } from "fs";
import fs from "fs";
async function main() {
    async function writeData(value) {
        try {
            fs.writeFileSync("data.json", JSON.stringify(value, null, 2));
        }
        catch (e) {
            throw new Error(`error write value: ${e}`);
        }
        ;
    }
    // Validate wallet and network
    if (!NFT_config.ownerSeed || !NFT_config.endpoint)
        throw new Error("Env not set");
    const account = Sr25519Account.fromUri(NFT_config.ownerSeed);
    const Owner = account.address;
    console.log(`Running from: ${Owner}, url: ${NFT_config.endpoint}`);
    const sdk = new Sdk({ baseUrl: NFT_config.endpoint, signer: account.signer });
    fs.writeFileSync("data.json", JSON.stringify("=============================== Data =============================\n\n", null, 2));
    console.log("===== Uploading Files =======");
    const rootdir = "C:/Users/lenovo/Desktop/Work/COC_TSETING/images";
    const RawFiles = fs.readdirSync(rootdir, { encoding: "binary" });
    const files = [];
    if (RawFiles.length >= 1) {
        for (let i = 0; i < RawFiles.length; i++) {
            const NftData = readFileSync(`${rootdir}/${RawFiles[i]}`);
            const data = {
                content: NftData, name: `${RawFiles[i]}`
            };
            files.push(data);
        }
        console.log({ files });
    }
    if (files) {
        const { cid, fullUrl } = await sdk.ipfs.uploadFiles({ files });
        const write_data = ` NFTS = [
            {
                'cid': ${cid},
                'Fullurl': ${fullUrl}
            }
        ]`;
        const words = JSON.stringify(write_data);
        fs.appendFile("data.json", words, () => {
            console.log("=========== ❤️😊😊😊 ================");
        });
    }
    console.log("====== DONE!!!!! ❤️😊👌🥷=======");
    // const COC_Collection = create_COC_Collection(sdk, Owner)
}
await main();
