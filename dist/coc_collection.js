import { NFT_config } from "./config.js";
import fs from 'fs';
export const create_COC_Collection = async (sdk, address) => {
    function readData() {
        try {
            const data = fs.readFileSync('data.json', 'utf8');
            const jsonData = JSON.parse(data);
            if (jsonData.cid || jsonData.fullUrl) {
                return jsonData;
            }
            else {
                console.log('check Data file ');
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
    const result = await sdk.collections.creation.submitWaitResult({
        // address of person that makes transaction (our admin)
        address,
        name: NFT_config.collectionName,
        description: "Polkadot Based NFTs for the ChessOnChain Blockchain",
        tokenPrefix: "COC_#",
        // meta data for token
        schema: {
            schemaName: "unique", // please don't touch
            schemaVersion: "1.0.0",
            // collection image
            coverPicture: {
                url: `https://ipfs.unique.network/ipfs/QmY7s3P36uY9q1v2x1m8nz5i8x7FAnJPYbCZiYpiRjgE4K/COC_1.png`,
            },
            // template that can be used for tokens (will replace "infix" with token id in token.image)
            image: {
                urlTemplate: "https://ipfs.unique.network/ipfs/Qmappk5md8GQqsueCgP4ARuu1WNUyvoN4gLhJkdf9akk3b/COC_{infix}.png", // used if you have different images for each token based on some pattern (ex. "url/image/{index}.png")
            },
            attributesSchemaVersion: "1.0.0",
            // token attributes schema defines which attributes can be used in collection tokens
            // it maintance mutability and validation
            attributesSchema: {
                0: {
                    name: { _: "Rank" }, // "_" is for translation matter. Lower dash means "default" language
                    type: "string",
                    enumValues: {
                        "0": { "_": "King" },
                        "1": { "_": "Queen" },
                        "2": { "_": "Bishop" },
                        "3": { "_": "Rook" },
                        "4": { "_": "Knight" },
                        "5": { "_": "Pawn" }
                    },
                    isArray: false, // is multiple choice available
                    optional: false,
                },
            },
        },
        // setup who can change those properties
        tokenPropertyPermissions: [
            {
                key: "0",
                permission: {
                    collectionAdmin: false, // default true
                    mutable: false, // default false
                    tokenOwner: false, // default false
                },
            },
            {
                key: "1",
                permission: {
                    collectionAdmin: false,
                    mutable: false,
                    tokenOwner: false,
                },
            },
        ],
        permissions: {
            nesting: {
                tokenOwner: true, // default false
            },
        },
    });
    if (!result.parsed?.collectionId) {
        console.dir(result, { depth: 10 });
        throw new Error("Failed to create collection");
    }
    return result.parsed?.collectionId;
};
export const create_COC_tokens = async (sdk, address, collectionId, amount) => {
    const perBulk = 50; // amount of tokens to create per iteration
    let created = 0;
    let tokens;
    while (created < amount) {
        // if target amount = 99
        // created = 50, toCreate will be lft as 49 - otherwise continue with bulks
        let toCreate = amount - created;
        if (toCreate > perBulk)
            toCreate = perBulk;
        const tokensToCreate = [...new Array(toCreate)].map((_, index) => {
            return {
                // we can mint on some one else address
                owner: address,
                data: {
                    image: {
                        url: `https://ipfs.unique.network/ipfs/Qmap7uz7JKZNovCdLfdDE3p4XA6shghdADS7EsHvLjL6jT/COC_${index}.png`,
                    },
                    // make sure to follow the schema from collection. Order matters
                    encodedAttributes: {
                        0: {
                            _: `Rank: ${index}`,
                        },
                    },
                },
            };
        });
        tokens = await sdk.tokens.createMultiple.submitWaitResult({
            address,
            collectionId,
            tokens: tokensToCreate,
        });
        created += toCreate;
        if (tokens)
            return tokens;
    }
};
