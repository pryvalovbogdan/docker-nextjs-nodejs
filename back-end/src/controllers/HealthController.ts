import { Request, Response } from 'express';

class HealthController {
  check = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).send('OK');
  };
}

export default HealthController;
