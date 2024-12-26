import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { AdminService } from '../services';
import { encrypt } from '../utils/encrypt';
import responseHandler from '../utils/responseHandler';

class AdminController {
  private service: AdminService = new AdminService();

  login = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responseHandler.sendValidationResponse(res, errors.array());

      return;
    }

    const { username, passwordHash } = req.body;

    const result = await this.service.login(username, passwordHash);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      const token = encrypt.generateToken({
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
      });

      responseHandler.sendSuccessResponse(res, 'Login successful', { token });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      responseHandler.sendValidationResponse(res, errors.array());

      return;
    }

    const result = await this.service.register(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'Admin registered successfully', result.data);
  };
}

export default AdminController;
