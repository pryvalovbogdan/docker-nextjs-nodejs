import { News } from '../entities';
import { NewsRepository } from '../repositories';

class NewsService {
  private repository: NewsRepository = new NewsRepository();

  async getNews(): Promise<{ data?: News[]; errors: string[] }> {
    try {
      const news = await this.repository.getNews();

      return { data: news, errors: [] };
    } catch (err) {
      console.error('Error retrieving news:', err);

      return { errors: ['Error retrieving news:'] };
    }
  }

  async addNews(newsData: Partial<News>): Promise<{ data?: News | null; errors: string[] }> {
    try {
      const news = new News();

      Object.assign(news, newsData);
      const savedProduct = await this.repository.saveNews(news);

      return { data: savedProduct, errors: [] };
    } catch (error) {
      console.error('Error in News:', error);

      return { errors: ['Failed to add News'] };
    }
  }

  async updateNews(newsId: number, data: Partial<News>): Promise<{ data?: News | null; errors: string[] }> {
    try {
      const updatedProduct = await this.repository.updateNews(newsId, data);

      return { data: updatedProduct, errors: [] };
    } catch (error) {
      console.error('Error in updateNews:', error);

      return { errors: ['Failed to update news'] };
    }
  }
}

export default NewsService;
