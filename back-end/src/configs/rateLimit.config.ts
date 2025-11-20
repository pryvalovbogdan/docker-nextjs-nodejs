import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 50,
  message: { status: 'Error', message: 'Too many orders created, please try again later.' },
  standardHeaders: true,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { status: 'Error', message: 'Too many contact requests, please try again later.' },
  standardHeaders: true,
});

export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  message: { status: 'Error', message: 'Too many search requests, please try again later.' },
  standardHeaders: true,
});

export const exportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 1,
  message: { status: 'Error', message: 'Too many export requests, please try again later.' },
  standardHeaders: true,
});
