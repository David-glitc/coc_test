import { Sdk } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";
import { NFT_config } from "./config.js";
import { create_COC_Collection } from "./coc_collection.js";
import { readFileSync } from "fs";
import fs from "fs";
async function main() {
    async function writeData(value) {
        try {
            const DataFIle = JSON.parse(JSON.stringify(fs.readFileSync("data.json")));
            if (DataFIle) {
                fs.appendFile("data.json", JSON.stringify(value, null, 2), (err) => {
                    if (err)
                        throw err;
                    console.log('The "data to append" was appended to file!');
                });
            }
            else {
                fs.writeFileSync("data.json", JSON.stringify(value, null, 2));
            }
        }
        catch (error) {
            throw new Error(`Error writing data: ${error}`);
        }
    }
    // Validate wallet and network configuration
    if (!NFT_config.ownerSeed || !NFT_config.endpoint) {
        throw new Error("Environment variables not set");
    }
    const account = Sr25519Account.fromUri(NFT_config.ownerSeed);
    const ownerAddress = account.address;
    console.log(`Running from: ${ownerAddress}, URL: ${NFT_config.endpoint}`);
    const sdk = new Sdk({ baseUrl: NFT_config.endpoint, signer: account.signer });
    console.log("===== Uploading Files =======");
    const rootDirectory = "C:/Users/lenovo/Desktop/Work/COC_TSETING/images";
    const rawFiles = fs.readdirSync(rootDirectory, { encoding: "binary" }).sort();
    const filesToUpload = [];
    if (rawFiles.length > 0) {
        for (const fileName of rawFiles) {
            const nftData = readFileSync(`${rootDirectory}/${fileName}`);
            filesToUpload.push({ content: nftData, name: fileName });
        }
    }
    if (filesToUpload.length > 0) {
        const uploadResponse = await sdk.ipfs.uploadFiles({ files: filesToUpload });
        const { cid, fullUrl } = uploadResponse;
        const nftData = {
            NFTs: [
                {
                    "cid": cid,
                    "fullUrl": fullUrl
                }
            ]
        };
        writeData(nftData);
    }
    console.log("====== DONE!!!!! ❤️😊👌🥷=======");
    console.log('========== creating collection ===========');
    const cocCollection = await create_COC_Collection(sdk, ownerAddress);
    console.log(`collestion is is : ${cocCollection.toLocaleString}`);
    fs.writeFileSync("IdLogs.txt", "");
    fs.appendFile('IdLogs.txt', `
    {Last id : ${cocCollection.toString}}
    `, (err) => {
        if (err)
            throw err;
        console.log('The "data to append" was appended to file!');
    });
}
await main();
