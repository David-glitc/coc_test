import {Sdk} from "@unique-nft/sdk"
import {Sr25519Account} from "@unique-nft/sr25519"
import { NFT_config } from "./config"


if (NFT_config.ownerSeed) {
    const account = Sr25519Account.fromUri(NFT_config.ownerSeed)

    console.log(account.address)
    
}