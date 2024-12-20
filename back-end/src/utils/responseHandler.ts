import { Response } from 'express';
import { ValidationError } from 'express-validator';

type TResponseHandler = {
  sendValidationResponse: (res: Response, errors: ValidationError[]) => Response;
  sendUnauthorizedResponse: <T>(res: Response, data: T) => Response;
  sendForbiddenResponse: <T>(res: Response, message: string, data: T) => Response;
  sendSuccessResponse: <T>(res: Response, message: string, data: T) => Response;
  sendFailResponse: (res: Response, message: string) => Response;
  sendCatchResponse: (res: Response, message: string) => Response;
};

const responseHandler: TResponseHandler = {
  sendValidationResponse: (res: Response, errors: ValidationError[]): Response => {
    return res.status(422).send({
      message: errors[0].msg,
      errors: errors[0],
    });
  },

  sendUnauthorizedResponse: <T>(res: Response, data: T): Response => {
    return res.status(401).send({
      message: 'User unauthorized',
      data: data,
    });
  },

  sendForbiddenResponse: <T>(res: Response, message: string, data: T): Response => {
    return res.status(403).send({
      message: message ? message : 'Access forbidden',
      data: data,
    });
  },

  sendSuccessResponse: <T>(res: Response, message: string, data: T): Response => {
    return res.status(200).send({
      message: message ? message : 'Success',
      data: data,
    });
  },

  sendFailResponse: (res: Response, message: string): Response => {
    return res.status(404).send({
      message: message ? message : 'Failed',
    });
  },

  sendCatchResponse: (res: Response, message: string): Response => {
    return res.status(500).send({
      message: message ? message : 'Internal server error',
    });
  },
};

export default responseHandler;
