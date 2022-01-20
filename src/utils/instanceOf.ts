import { NFTDto } from 'src/nft';

export function instanceOfNFTDto(object: any): object is NFTDto {
  return 'supply' in object;
}
