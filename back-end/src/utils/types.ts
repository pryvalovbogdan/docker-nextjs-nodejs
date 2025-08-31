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

export interface ISebCategoryResponse {
  id: number;
  name: string;
  path: string;
  title: string | null;
  heading: string | null;
  description: string | null;
  keywords: string | null;
  position: number;
  subCategories: {
    id: number;
    name: string;
    path: string | null;
    title: string | null;
    heading: string | null;
    description: string | null;
    keywords: string | null;
    position: number;
  }[];
}

type Lang = 'uk' | 'ru';

type FieldKeys = 'name' | 'title' | 'heading' | 'description' | 'keywords';

export type FieldsMap = Record<Lang, Record<FieldKeys, string>>;
