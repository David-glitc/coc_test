export const NFT_config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    ownerSeed: 'release west before bright drop ill urge track photo mandate bar various',

    imagePartsFolder: './images',
    imagePrefix: 'COC_',
    imageWidth: 1706,
    coverFileName: 'cover.png',
    collectionName: 'COC_test',
    collectionDescription: 'test deployment for the coc nft collection',
    tokenPrefix: 'COC',
    // imagesInParallel: require('os').cpus().length,
    attributes: { 
        name: 'Rank', required: true, values: ['King', "Queen", "Bishop", "Rook", "Knight","Pawn"] 
    },
    desiredCount: 20,
    numberOfTokensGeneratedAtOnce: 10,


}