import { Request, Response } from 'express';

import { NewsService } from '../services';
import responseHandler from '../utils/responseHandler';

class NewsController {
  private service: NewsService = new NewsService();

  getNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getNews();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'News retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying news:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  addNews = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.addNews(req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    responseHandler.sendSuccessResponse(res, 'News added successfully', result.data);
  };

  updateNews = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await this.service.updateNews(Number(id), req.body);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'News updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'News not found');
    }
  };
}

export default NewsController;
