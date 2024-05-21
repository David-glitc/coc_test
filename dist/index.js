"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sr25519_1 = require("@unique-nft/sr25519");
const config_1 = require("./config");
if (config_1.NFT_config.ownerSeed) {
    const account = sr25519_1.Sr25519Account.fromUri(config_1.NFT_config.ownerSeed);
    console.log(account.address);
}
