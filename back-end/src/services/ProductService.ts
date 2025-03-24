import { stringify } from 'csv-stringify/sync';

import { Category, Product, SubCategory } from '../entities';
import { ProductRepository } from '../repositories';
import CategoryService from './CategoryService';
import SubCategoryService from './SubCategoryService';

class ProductService {
  private repository: ProductRepository = new ProductRepository();

  private categoryService: CategoryService = new CategoryService();

  private subCategoryService: SubCategoryService = new SubCategoryService(); // Initialize SubCategory Service

  async addProduct(productData: Partial<Product>): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      if (!productData.category || !productData.category.name) {
        return { errors: ['Category is required'] };
      }

      let category = (await this.categoryService.getCategory(productData.category.name)).data;

      if (!category) {
        const createCategoryResult = await this.categoryService.createCategory(productData.category.name);

        if (createCategoryResult.errors.length) {
          return { errors: createCategoryResult.errors };
        }

        category = createCategoryResult.data!;
      }

      let subCategory = null;

      if (productData.subCategory && productData.subCategory.name) {
        subCategory = (await this.subCategoryService.getSubCategory(productData.subCategory.name)).data;

        if (!subCategory) {
          const createSubCategoryResult = await this.subCategoryService.createSubCategory(
            productData.subCategory.name,
            category.id,
          );

          if (createSubCategoryResult.errors.length) {
            return { errors: createSubCategoryResult.errors };
          }

          subCategory = createSubCategoryResult.data;
        }
      }

      const product = new Product();

      Object.assign(product, productData);
      product.category = category;
      product.subCategory = subCategory || undefined;

      const savedProduct = await this.repository.saveProduct(product);

      return { data: savedProduct, errors: [] };
    } catch (error) {
      console.error('Error in addProduct:', error);

      return { errors: ['Failed to add product'] };
    }
  }

  async updateProduct(productId: number, data: Partial<Product>): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      let category = null;
      let subCategory = null;

      if (data.category?.name) {
        category = (await this.categoryService.getCategory(data.category.name)).data;
      }

      if (data.subCategory?.name) {
        subCategory = (await this.subCategoryService.getSubCategory(data.subCategory.name)).data;
      }

      const updatedProduct = await this.repository.updateProduct(productId, {
        ...data,
        category: category as Category,
        subCategory: subCategory as SubCategory,
      });

      return { data: updatedProduct, errors: [] };
    } catch (error) {
      console.error('Error in updateProduct:', error);

      return { errors: ['Failed to update product'] };
    }
  }

  async deleteProduct(productId: number): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      const product = await this.repository.getProductById(productId);

      if (!product) {
        return { errors: ['Product not found'] };
      }

      await this.repository.deleteProduct(productId);

      const remainingProductsInCategory = await this.repository.countProductsByCategory(product.category.id);

      if (remainingProductsInCategory === 0) {
        await this.categoryService.deleteCategory(product.category.id);
      }

      if (product.subCategory) {
        const remainingProductsInSubCategory = await this.repository.countProductsBySubCategory(product.subCategory.id);

        if (remainingProductsInSubCategory === 0) {
          await this.subCategoryService.deleteSubCategory(product.subCategory.id);
        }
      }

      return { data: product, errors: [] };
    } catch (error) {
      console.error('Error in deleteProduct:', error);

      return { errors: ['Failed to delete product'] };
    }
  }

  async getProducts(): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.getProducts();

      return { data: products, errors: [] };
    } catch (err) {
      console.error('Error retrieving products:', err);

      return { errors: ['Error retrieving products'] };
    }
  }

  async getProductsOffset(
    limit: number,
    page: number,
  ): Promise<{ data?: { products: Product[]; totalPages: number }; errors: string[] }> {
    try {
      const offset = (page - 1) * limit;
      const { products, totalCount } = await this.repository.getProductsOffset(limit, offset);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: {
          products: products as Product[],
          totalPages,
        },
        errors: [],
      };
    } catch (err) {
      console.error('Error retrieving products with pagination:', err);

      return { errors: ['Error retrieving products'] };
    }
  }

  async getProductById(id: number): Promise<{ data?: Product; errors: string[] }> {
    try {
      const product = await this.repository.getProductById(id);

      if (product) {
        return { data: product, errors: [] };
      } else {
        return { errors: ['Product with the given ID not found'] };
      }
    } catch (err) {
      console.error('Error retrieving product by ID:', err);

      return { errors: ['Error retrieving product by ID'] };
    }
  }

  async getProductsByCategory(category: string): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.getProductsByCategory(category);

      if (products.length > 0) {
        return { data: products, errors: [] };
      } else {
        return { errors: ['No products found in this category'] };
      }
    } catch (err) {
      console.error('Error retrieving products by category:', err);

      return { errors: ['Error retrieving products by category'] };
    }
  }

  async getCategories(): Promise<{ data?: string[]; errors: string[] }> {
    try {
      const categories = await this.repository.getCategories();

      if (categories.length > 0) {
        return { data: categories, errors: [] };
      } else {
        return { errors: ['No categories found'] };
      }
    } catch (err) {
      console.error('Error retrieving categories:', err);

      return { errors: ['Error retrieving categories'] };
    }
  }

  async getProductsBySubCategory(category: string): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.getProductsBySubCategory(category);

      if (products.length > 0) {
        return { data: products, errors: [] };
      } else {
        return { errors: ['No products found in this category'] };
      }
    } catch (err) {
      console.error('Error retrieving products by category:', err);

      return { errors: ['Error retrieving products by category'] };
    }
  }

  async getProductByBrandName(name: string): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.getProductsByBrand(name);

      if (products.length > 0) {
        return { data: products, errors: [] };
      } else {
        return { errors: ['No products found in this brand name'] };
      }
    } catch (err) {
      console.error('Error retrieving products by brand name:', err);

      return { errors: ['Error retrieving products by brand name'] };
    }
  }

  async getLastAddedProducts(): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.getLastAddedProducts();

      if (products.length > 0) {
        return { data: products, errors: [] };
      } else {
        return { errors: ['No recently added products found'] };
      }
    } catch (err) {
      console.error('Error retrieving last 10 products:', err);

      return { errors: ['Error retrieving last 10 products'] };
    }
  }

  async searchProducts(searchText: string): Promise<{ data?: Product[]; errors: string[] }> {
    try {
      const products = await this.repository.searchProducts(searchText);

      if (products.length > 0) {
        return { data: products, errors: [] };
      } else {
        return { errors: ['No products found matching the search criteria'] };
      }
    } catch (error) {
      console.error('Error searching for products:', error);

      return { errors: ['Error searching for products'] };
    }
  }

  async exportProductsToCSV(): Promise<{ data: Buffer; filename: string }> {
    try {
      const products = await this.repository.getProducts();

      if (!products || products.length === 0) {
        throw new Error('No products available for export.');
      }

      const csvString = stringify(
        products.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || '',
          characteristics: product.characteristics || '',
          brand: product.brand || '',
          country: product.country || '',
          price: product.price || '',
          category: product.category?.name || '',
          subCategory: product.subCategory?.name || '',
          images: product.images?.join('|') || '',
        })),
        { header: true },
      );

      return {
        data: Buffer.from(csvString),
        filename: `products_export_${Date.now()}.csv`,
      };
    } catch (error) {
      console.error('Error exporting products:', error);
      throw new Error('Failed to generate CSV for products.');
    }
  }
}

export default ProductService;
