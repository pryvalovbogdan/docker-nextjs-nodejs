import { body, query } from 'express-validator';

import { TMethodValidation } from './types';

export const validateAdminProps = (method: TMethodValidation) => {
  switch (method) {
    case 'login': {
      return [body('username').not().isEmpty(), body('password').not().isEmpty()];
    }

    case 'register': {
      return [body('username').not().isEmpty(), body('password').not().isEmpty()];
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
  }
};