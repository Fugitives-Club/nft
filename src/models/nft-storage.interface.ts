export type Meta = Record<string, unknown>;

export interface Pin {
  cid: string;
  name: string;
  meta: Meta;
  status: string;
  created: Date;
  size: number;
}

export interface File {
  name: string;
  type: string;
}

export interface Deal {
  batchRootCid: string;
  lastChange: Date;
  miner: string;
  network: string;
  pieceCid: string;
  status: string;
  statusText: string;
  chainDealID: number;
  dealActivation: Date;
  dealExpiration: Date;
}

export interface Value {
  cid: string;
  size: number;
  created: Date;
  type: string;
  scope: string;
  pin: Pin;
  files: File[];
  deals: Deal[];
}

export interface Error {
  name: string;
  message: string;
}

export interface ResponseSuccess {
  ok: true;
}

export interface UploadResponseSuccess extends ResponseSuccess {
  value: Value;
}

export interface ResponseError {
  ok: false;
  error: Error;
}

export type UploadResponse = UploadResponseSuccess | ResponseError;

export type DeleteResponse = ResponseSuccess | ResponseError;
