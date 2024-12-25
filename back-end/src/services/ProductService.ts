import { Product } from '../entities';
import { ProductRepository } from '../repositories';

class ProductService {
  private repository: ProductRepository = new ProductRepository();

  async addProduct(productData: Partial<Product>): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      const product = new Product();

      Object.assign(product, productData);
      const savedProduct = await this.repository.saveProduct(product);

      return { data: savedProduct, errors: [] };
    } catch (error) {
      console.error('Error in addProduct:', error);

      return { errors: ['Failed to add product'] };
    }
  }

  async updateProduct(productId: number, data: Partial<Product>): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      const updatedProduct = await this.repository.updateProduct(productId, data);

      return { data: updatedProduct, errors: [] };
    } catch (error) {
      console.error('Error in updateProduct:', error);

      return { errors: ['Failed to update product'] };
    }
  }

  async deleteProduct(productId: number): Promise<{ data?: Product | null; errors: string[] }> {
    try {
      const deletedProduct = await this.repository.deleteProduct(productId);

      return { data: deletedProduct, errors: [] };
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

  async getProductsOffset(page: number, limit: number): Promise<{ data?: Product[]; errors: string[] }> {
    const offset = (page - 1) * limit;

    try {
      const products = await this.repository.getProductsOffset(limit, offset);

      return { data: products, errors: [] };
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
}

export default ProductService;
