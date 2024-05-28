import { Sdk } from "@unique-nft/sdk";
import { Sr25519Account } from "@unique-nft/sr25519";
import { NFT_config } from "./config.js";
import { create_COC_Collection, create_COC_tokens } from "./coc_collection.js";
import { readFileSync } from "fs";
import fs from "fs";
async function main() {
    async function writeData(value) {
        try {
            if (fs.existsSync("data.json")) {
                const DataFIle = JSON.parse(JSON.stringify(fs.readFileSync("data.json")));
                console.log(DataFIle);
                fs.appendFile("data.json", JSON.stringify(`,
                    ${value}`, null, 2), (err) => {
                    if (err)
                        throw err;
                    console.log('The "data to append" was appended to file!');
                });
            }
            else {
                console.log("No data File seen creating ome =================");
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
            "cid": cid,
            "fullUrl": fullUrl
        };
        writeData(nftData);
    }
    console.log("====== DONE!!!!! ❤️😊👌🥷=======");
    function readData() {
        try {
            const data = fs.readFileSync('data.json', 'utf8');
            const jsonData = JSON.parse(data);
            if (jsonData) {
                return jsonData;
            }
            else {
                console.log('check Data file ================ ');
            }
        }
        catch (error) {
            console.error(`Error reading data: ${error}`);
        }
    }
    const nftLink = readData();
    console.log(`$============{nftLink}=============`);
    // const Cover_Picture_url = nftLink?.fullUrl
    console.log('==========================================================');
    console.log(nftLink);
    console.log('==========================================================');
    console.log('========== creating collection ===========');
    const cocCollection = await create_COC_Collection(sdk, ownerAddress);
    console.log('===================== CREATED COLLECTION ===============');
    console.log(`collestion is is : ${cocCollection}`);
    fs.writeFileSync("IdLogs.txt", "");
    fs.appendFile('IdLogs.txt', `
    {Last id : ${cocCollection}}
    `, (err) => {
        if (err)
            throw err;
        console.log('The "data to append" was appended to file!');
    });
    console.log('===================== CREATED LOG FILE  ===============');
    console.log('===================== Cresting Tokens ==============');
    const coc_tokens = await create_COC_tokens(sdk, ownerAddress, cocCollection, 9);
    console.log(coc_tokens);
}
await main();
