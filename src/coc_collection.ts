import {Client, Sdk } from "@unique-nft/sdk";
import { NFT_config } from "./config.js";

export const create_COC_Collection = async ( sdk: Client, address: string  ) => {
    
    const result = await sdk.collections.creation.submitWaitResult({
        // address of person that makes transaction (our admin)
        address,
        name: NFT_config.collectionName,
        description: "Polkadot Based NFTs for the ChessOnChain Blockchain",
        tokenPrefix: "COC",
        // meta data for token
        schema: {
            schemaName: "unique", // please don't touch
            schemaVersion: "1.0.0",
            // collection image
            coverPicture: {
                url: "https://ipfs.uniquenetwork.dev/ipfs/QmUpNzjmAnnrrYgtLeWC6UEPaH2c37nzuhiU6UiwYq5pSW",
            },
            // template that can be used for tokens (will replace "infix" with token id in token.image)
            image: {
                urlTemplate: "{infix}", // used if you have different images for each token based on some pattern (ex. "url/image/{index}.png")
            },
            attributesSchemaVersion: "1.0.0",
            // token attributes schema defines which attributes can be used in collection tokens
            // it maintance mutability and validation
            attributesSchema: {
                0: {
                    name: { _: "Rank" }, // "_" is for translation matter. Lower dash means "default" language
                    type: "string",
                    isArray: true, // is multiple choice available
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

export const create_COC_tokens = async (
    sdk: Client,
    address: string,
    collectionId: number,
    amount: number
  ) => {
    const perBulk = 50; // amount of tokens to create per iteration
    let created = 0;
    while (created < amount) {
      // if target amount = 99
      // created = 50, toCreate will be lft as 49 - otherwise continue with bulks
      let toCreate = amount - created;
      if (toCreate > perBulk) toCreate = perBulk;
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
  
      await sdk.tokens.createMultiple.submitWaitResult({
        address,
        collectionId,
        tokens: tokensToCreate,
      });
      created += toCreate;
    }
  };

