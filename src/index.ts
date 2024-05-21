import { IpfsUploadResponse, Sdk } from "@unique-nft/sdk"
import { Sr25519Account } from "@unique-nft/sr25519"
import { NFT_config } from "./config.js"
import prompt from "prompt";
import { create_COC_Collection } from "./coc_collection.js";
import { readFileSync } from "fs";
import path from "path";
import fs from "fs";


async function main() {
    
    async function writeData(value: IpfsUploadResponse) {
        try {
                fs.writeFileSync("data.json", JSON.stringify(value, null, 2));

        } catch (e) {
            throw new Error(`error write value: ${e}`);
        };
    }

    // Validate wallet and network

    if (!NFT_config.ownerSeed || !NFT_config.endpoint) throw new Error("Env not set");

    const account = Sr25519Account.fromUri(NFT_config.ownerSeed)
    const Owner = account.address;
    console.log(`Running from: ${Owner}, url: ${NFT_config.endpoint}`);
    const sdk = new Sdk({ baseUrl: NFT_config.endpoint, signer: account.signer });
    console.log("===== Uploading Files =======")

    const uploadFile = async (file: Buffer) => {
        
    
        // the "uploadZip" method can be used to upload archives
        return sdk.ipfs.uploadFile({ file });
      };
    
     const fileurl = await uploadFile(fs.readFileSync("C:/Users/lenovo/Desktop/Work/COC_TSETING/src/COC_46.zip"))
    
    console.log("====== done ❤️😊👌🥷=======")

    console.log(`Images uploaded and available at ${fileurl.fileUrl}`);

    writeData(fileurl);
    // const COC_Collection = create_COC_Collection(sdk, Owner)
}

await main()