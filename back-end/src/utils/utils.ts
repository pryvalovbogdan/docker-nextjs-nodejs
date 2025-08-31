import crypto from 'crypto';

export const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
