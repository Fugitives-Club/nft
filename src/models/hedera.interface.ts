export interface HederaAccount {
  accountId: string;
  privateKey: string;
  environment?: HederaEnvironment;
}

export interface NFT {
  /** Name of the NFT */
  name: string;
  /** Description of the NFT */
  description: string;
  /** Category of the NFT */
  category: CategoryNFT;
  /** Creator of the NFT */
  creator: string;
  /** Media to linked to the NFT - base64 */
  media: string;
  /** Attributes */
  attributes: NftAttribute[];
  /** Custom JSON Properties */
  customProperties: Record<string, unknown> | null;
}

export interface NFTDto extends NFT {
  /** Quantity of NFT to create - only if you provide one nft */
  supply: number;
  /** Custom Royalty Fees  */
  customRoyaltyFee: CustomFee[] | null;
}

export interface TokenDto {
  /** Name of the Token */
  name: string;
  /** Symbol of the Token */
  symbol: string;
  /** Custom Royalty Fees  */
  customRoyaltyFee: CustomFee[] | null;
  /** Array of nfts */
  nfts: NFT[];
}

export interface NftAttribute {
  trait_type: string;
  value: string;
}
export interface NftCreated {
  urls: string[];
  txId: string;
  tokenId: string;
  nftIds: Array<string>;
}

export interface CreateNFT {
  name: string;
  symbol: string;
  supply?: number;
  customFees?: CustomFee[] | null;
  cids: string[];
  nfts: NFT[];
  supplyKey?: string;
  adminKey?: string,
}

export interface NFTProperties {
  trait_type: string;
  value: string;
}

export interface Fees {
  hbar: number;
  usd: number;
}

export enum HederaEnvironment {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum CategoryNFT {
  ART = 'Art',
  DIGITAL_ART = 'Digital art',
  MUSIC = 'Music',
  COLLECTIBLE = 'Collectible',
  DOCUMENT = 'Document',
  OTHER = 'Other',
}

export interface CustomFee {
  numerator: number;
  denominator: number;
  fallbackFee?: number;
  collectorAccountId: string;
}
