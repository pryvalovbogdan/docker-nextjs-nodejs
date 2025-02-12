import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `windowMs`
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
