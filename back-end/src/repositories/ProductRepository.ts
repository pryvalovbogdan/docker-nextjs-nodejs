import { ILike, Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Product } from '../entities';

class ProductRepository {
  private productRepository: Repository<Product> = AppDataSource.manager.getRepository(Product);

  saveProduct = async (product: Product): Promise<Product> => {
    return this.productRepository.save(product);
  };

  updateProduct = async (productId: number, data: Partial<Product>): Promise<Product | null> => {
    const currentProduct = await this.productRepository.findOne({
      where: { id: productId },
    });

    await this.productRepository.update(productId, { ...data, images: currentProduct?.images });

    return await this.productRepository.findOne({
      relations: ['category', 'subCategory'],
      where: { id: productId },
    });
  };

  deleteProduct = async (productId: number): Promise<Product | null> => {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (product) {
      await this.productRepository.remove(product);
    }

    return product;
  };

  getProducts = async (): Promise<Product[]> => {
    return this.productRepository.find({
      relations: ['category', 'subCategory'],
    });
  };

  getProductsOffset = async (
    limit: number,
    offset: number,
  ): Promise<{ products: Partial<Product>[]; totalCount: number }> => {
    const [products, totalCount] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.subCategory', 'subCategory')
      .select([
        'product.id',
        'product.title',
        'product.description',
        'product.characteristics',
        'product.images',
        'product.brand',
        'product.country',
        'product.price',
        'category.name',
        'subCategory.name',
      ])
      .orderBy('product.id', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { products, totalCount };
  };

  getProductById = async (id: number): Promise<Product | null> => {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'subCategory'],
    });
  };

  getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
    return this.productRepository.find({
      relations: ['category', 'subCategory'],
      where: {
        category: {
          name: categoryName,
        },
      },
    });
  };

  getProductsBySubCategory = async (subCategoryName: string): Promise<Product[]> => {
    return this.productRepository.find({
      relations: ['category', 'subCategory'],
      where: {
        subCategory: {
          name: subCategoryName,
        },
      },
    });
  };

  getProductsByBrand = async (brand: string): Promise<Product[]> => {
    return this.productRepository.find({
      where: {
        brand: ILike(`%${brand}%`),
      },
      relations: ['category', 'subCategory'],
    });
  };

  getCategories = async (): Promise<string[]> => {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .select('DISTINCT category.name', 'category')
      .getRawMany();

    return categories.map(c => c.category);
  };

  getSubCategories = async (): Promise<string[]> => {
    const subCategories = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .select('DISTINCT subCategory.name', 'subCategory')
      .getRawMany();

    return subCategories.map(sc => sc.subCategory);
  };

  getBrands = async (): Promise<string[]> => {
    const brands = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.brand IS NOT NULL')
      .getRawMany();

    return brands.map(b => b.brand);
  };

  getLastAddedProducts = async (): Promise<Product[]> => {
    return this.productRepository.find({
      order: { id: 'DESC' },
      take: 10,
      relations: ['category', 'subCategory'],
    });
  };

  searchProducts = async (searchText: string): Promise<Product[]> => {
    return this.productRepository.find({
      relations: ['category', 'subCategory'],
      where: [
        { title: ILike(`%${searchText}%`) },
        { brand: ILike(`%${searchText}%`) },
        { category: { name: ILike(`%${searchText}%`) } },
        { subCategory: { name: ILike(`%${searchText}%`) } },
      ],
      take: 15,
    });
  };

  async countProductsByCategory(categoryId: number): Promise<number> {
    return this.productRepository.count({ where: { category: { id: categoryId } } });
  }

  async countProductsBySubCategory(subCategoryId: number): Promise<number> {
    return this.productRepository.count({ where: { subCategory: { id: subCategoryId } } });
  }
}

export default ProductRepository;
