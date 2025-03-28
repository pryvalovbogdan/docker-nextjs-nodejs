import crypto from 'crypto';

export const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const normalize = (text: string) => text.replace(/i/g, 'і').trim();
