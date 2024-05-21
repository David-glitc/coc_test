import { Sdk } from "@unique-nft/sdk"
import { Account, Sr25519Account } from "@unique-nft/sr25519"
import { NFT_config } from "./config"
import { EventEmitter } from "prompt"



function main() {

    if (NFT_config.ownerSeed) {
        const account = Sr25519Account.fromUri(NFT_config.ownerSeed)
        console.log(account.address)        
    } else {
        throw new Error("No user Seed Phrase set");
    }


}

main()