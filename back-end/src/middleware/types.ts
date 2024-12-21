import { Request } from 'express';

export interface IDecodedJwtData {
  id: number;
  username: string;
  role: string;
}

export interface IRequestWithUser extends Pick<Request, 'headers' | 'method' | 'body' | 'query' | 'params' | 'url'> {
  user?: IDecodedJwtData;
}
