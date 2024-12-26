import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Product } from '../entities';

class ProductRepository {
  private productRepository: Repository<Product> = AppDataSource.manager.getRepository(Product);

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

  getCategories = async (): Promise<string[]> => {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return categories.map(c => c.category);
  };
}

export default ProductRepository;
