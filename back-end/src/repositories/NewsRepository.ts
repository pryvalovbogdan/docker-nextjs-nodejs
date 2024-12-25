import { Repository } from 'typeorm';

import { AppDataSource } from '../configs/data-source';
import { News } from '../entities';

class NewsRepository {
  private newsRepository: Repository<News> = AppDataSource.manager.getRepository(News);

  saveNews = async (news: News): Promise<News> => {
    return this.newsRepository.save(news);
  };

  updateNews = async (newsId: number, data: Partial<News>): Promise<News | null> => {
    await this.newsRepository.update(newsId, data);

    return this.newsRepository.findOne({ where: { id: newsId } });
  };

  getNews = async (): Promise<News[]> => {
    return this.newsRepository.find();
  };
}

export default NewsRepository;
