import { Readable } from 'stream';

export type TMethodValidation =
  | 'login'
  | 'register'
  | 'news'
  | 'product'
  | 'productId'
  | 'orders'
  | 'category'
  | 'contact';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
