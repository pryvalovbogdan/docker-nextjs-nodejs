import { ILike, Repository } from 'typeorm';

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

  getProductsOffset = async (limit: number, offset: number): Promise<{ products: Product[]; totalCount: number }> => {
    const [products, totalCount] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return { products, totalCount };
  };

  getProductById = async (id: number): Promise<Product | null> => {
    return this.productRepository.findOne({ where: { id } });
  };

  getProductsByCategory = async (category: string): Promise<Product[]> => {
    return this.productRepository.find({ where: { category } });
  };

  getProductsByBrand = async (brand: string): Promise<Product[]> => {
    return this.productRepository.find({
      where: {
        brand: ILike(`%${brand}%`), // Case-insensitive match
      },
    });
  };

  getCategories = async (): Promise<string[]> => {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return categories.map(c => c.category);
  };

  getBrands = async (): Promise<string[]> => {
    const brands = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.brand IS NOT NULL')
      .getRawMany();

    return brands.map(b => b.brand);
  };
}

export default ProductRepository;
