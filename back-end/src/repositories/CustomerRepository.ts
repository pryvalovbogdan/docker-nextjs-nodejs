import { EntityManager, Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { News, Order, Product } from '../entities';

class CustomerRepository {
  private productRepository: Repository<Product>;

  private newsRepository: Repository<News>;

  private orderRepository: Repository<Order>;

  private manager: EntityManager;

  constructor() {
    this.manager = AppDataSource.manager;
    this.productRepository = this.manager.getRepository(Product);
    this.newsRepository = this.manager.getRepository(News);
    this.orderRepository = this.manager.getRepository(Order);
  }

  getProducts = async (): Promise<Product[]> => {
    return this.productRepository.find();
  };

  getProductsOffset = async (limit: number, offset: number): Promise<Product[]> => {
    return this.productRepository.find({
      take: limit,
      skip: offset,
    });
  };

  getProductById = async (id: number): Promise<Product | null> => {
    return this.productRepository.findOne({ where: { id } });
  };

  getProductsByCategory = async (category: string): Promise<Product[]> => {
    return this.productRepository.find({ where: { category } });
  };

  getNews = async (): Promise<News[]> => {
    return this.newsRepository.find();
  };

  getCategories = async (): Promise<string[]> => {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return categories.map(c => c.category);
  };

  saveOrder = async (orderData: {
    firstName: string;
    lastName: string;
    phone: number;
    productId: number;
    status: string;
    date: Date;
  }): Promise<Order> => {
    const { firstName, lastName, phone, productId, status, date } = orderData;

    const product = await this.productRepository.findOne({ where: { id: productId } });

    console.log('productIdproductIdproductId', productId, product);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const newOrder = this.orderRepository.create({
      firstName,
      lastName,
      phone,
      date: date.toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
      product, // Pass the full product entity
      status,
    });

    return this.orderRepository.save(newOrder);
  };
}

export default CustomerRepository;
