import { body, query } from 'express-validator';

import { TMethodValidation } from './types';

export const validateProps = (method: TMethodValidation) => {
  switch (method) {
    case 'login': {
      return [body('username').not().isEmpty(), body('passwordHash').not().isEmpty()];
    }

    case 'register': {
      return [body('username').not().isEmpty(), body('passwordHash').not().isEmpty()];
    }

    case 'news': {
      return [body('title').not().isEmpty(), body('description').not().isEmpty()];
    }

    case 'product': {
      return [body('title').not().isEmpty(), body('description').not().isEmpty(), body('category').not().isEmpty()];
    }

    case 'productId': {
      return [query('id').not().isEmpty()];
    }

    case 'orders': {
      return [query('id').not().isEmpty()];
    }

    case 'category': {
      return [query('category').not().isEmpty()];
    }

    case 'contact': {
      return [body('email').not().isEmpty(), body('name').not().isEmpty(), body('message').not().isEmpty()];
    }
  }
};
