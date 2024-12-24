import { EntityManager, Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Admin, News, Order, Product } from '../entities';

class AdminRepository {
  private adminRepository: Repository<Admin>;

  private productRepository: Repository<Product>;

  private orderRepository: Repository<Order>;

  private newsRepository: Repository<News>;

  private manager: EntityManager;

  constructor() {
    this.manager = AppDataSource.manager;
    this.adminRepository = this.manager.getRepository(Admin);
    this.productRepository = this.manager.getRepository(Product);
    this.orderRepository = this.manager.getRepository(Order);
    this.newsRepository = this.manager.getRepository(News);
  }

  findAdminByUsername = async (username: string): Promise<Admin | null> => {
    return this.adminRepository.findOne({ where: { username } });
  };

  saveAdmin = async (admin: Admin): Promise<Admin> => {
    return this.adminRepository.save(admin);
  };

  // Arrow function, relies on `this`
  findOrders = async (): Promise<Order[]> => {
    return this.orderRepository.find({ relations: ['product'] });
  };

  // Arrow function, relies on `this`
  updateOrder = async (orderId: number, data: Partial<Order>): Promise<Order | null> => {
    await this.orderRepository.update(orderId, data);

    return this.orderRepository.findOne({ where: { id: orderId } });
  };

  // Arrow function, relies on `this`
  deleteOrder = async (orderId: number): Promise<Order | null> => {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (order) {
      await this.orderRepository.remove(order);
    }

    return order;
  };

  saveProduct = async (product: Product): Promise<Product> => {
    return this.productRepository.save(product);
  };

  updateProduct = async (productId: number, data: Partial<Product>): Promise<Product | null> => {
    await this.productRepository.update(productId, data);

    return this.productRepository.findOne({ where: { id: productId } });
  };

  deleteProduct = async (productId: number): Promise<Product | null> => {
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (product) {
      await this.productRepository.remove(product);
    }

    return product;
  };

  saveNews = async (news: News): Promise<News> => {
    return this.newsRepository.save(news);
  };

  updateNews = async (newsId: number, data: Partial<News>): Promise<News | null> => {
    await this.newsRepository.update(newsId, data);

    return this.newsRepository.findOne({ where: { id: newsId } });
  };
}

export default AdminRepository;
