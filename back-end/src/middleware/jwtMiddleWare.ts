import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IDecodedJwtData, IRequestWithUser } from './types';

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const validateAdminJWT = (req: IRequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  console.log('authHeader', authHeader);

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization token missing' });

    return;
  }

  const token = authHeader.startsWith?.('Bearer ') ? authHeader.split?.(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }) as IDecodedJwtData;

    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT validation error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
