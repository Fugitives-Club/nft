import axios from 'axios';
import { NFTDto } from 'src/models/hedera.interface';
import { DeleteResponse } from 'src/models/nft-storage.interface';
import { NFTStorage, File } from 'nft.storage';
import * as fs from 'fs';
import { extname } from 'path';
const storageBaseUrl = 'https://api.nft.storage';
const mime = require('mime-types');

export async function storeMetadata({
  token,
  name,
  description,
  supply,
  creator,
  category,
  customProperties,
  customRoyaltyFee,
  attributes,
  media,
}: NFTDto & { token: string; media: string }) {
  const file = fs.readFileSync(media);
  const extension = extname(media);
  const type = mime.lookup(media);
  const client = new NFTStorage({ token });
  const metadata = await client.store({
    name,
    description,
    creator,
    category,
    supply,
    properties: JSON.stringify(customProperties),
    royalties: customRoyaltyFee,
    attributes,
    image: new File([file], `media${extension}`, {
      type,
    }),
  });

  return metadata.url;
}

export async function deleteNFT({
  cid,
  token,
}: {
  cid: string;
  token: string;
}) {
  return axios.delete<DeleteResponse>(`${storageBaseUrl}/${cid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getExtension(base64: string) {
  const firstChar = base64.charAt(0);
  switch (firstChar) {
    case '/':
      return 'jpg';
    case 'i':
      return 'png';
    case 'R':
      return 'gif';
    case 'U':
      return 'webp';
  }
}
