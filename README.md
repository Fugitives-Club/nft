# `@fugitivesclub/nft`

> Create a NFT with Hedera and FileCoin

## Installation

1. Install package from npm and dependencies.

`npm i @fugitivesclub/nft`

## Before Starting

1. Please create your account on [Hedera Portal.](https://portal.hedera.com/register)

2. Please create your account on [NFT Storage.](https://nft.storage/login/)

## Usage

```typescript
/* Create a new instance of Client */
const hederaAccount = {
  accountId: 'YOUR_ACCOUNTID',
  privateKey: 'YOUR_PRIVATEKEY',
  environment: HederaEnvironment.TESTNET /* Default to MAINNET */,
};

/* Construct an instance of Client */
const client = new ClientNFT({
  hederaAccount,
  nftStorageApiKey: 'YOUR_TOKEN',
  debugLevel: DebugLevel.DEBUG /* Default to OFF */,
});

/* Get NFT's creation Fees */
const fees = await client.getFees();

/* Create NFT with unique metadata */
const name = 'NFT Test';
const description = 'Description of my NFT';
const category = CategoryNFT.ART;
const creator = 'Johny.B';
const media = ''; /* Path of your File eg: ./media.png */
const supply = 1; /* Nb of NFT available */
const customRoyaltyFee = [
  {
    numerator: 1,
    denominator: 10,
    fallbackFee: 100,
    collectorAccountId: '0.0.123456',
  },
];
await client.createAndMint({
  name,
  description,
  category,
  creator,
  media,
  supply,
  customRoyaltyFee,
});

/* Create NFT with multiple metadata under one token */
const name = 'NFT Test';
const customRoyaltyFee = [
  {
    numerator: 1,
    denominator: 10,
    fallbackFee: 100,
    collectorAccountId: '0.0.123456',
  },
];
const nfts: NFT = [
  {
    name: 'NFT Test 1',
    description: 'Description of my first NFT',
    category: CategoryNFT.ART,
    creator: 'Johny.B',
    attributes: [],
    customProperties: null,
    media: '',
  },
  {
    name: 'NFT Test 2',
    description: 'Description of my second NFT',
    category: CategoryNFT.ART,
    creator: 'Johny.B',
    attributes: [],
    customProperties: null,
    media: '',
  },
];
await client.createAndMint({ name, customRoyaltyFee, nfts });
```
