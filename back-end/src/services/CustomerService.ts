import { News, Product } from '../entities';
import CustomerRepository from '../repositories/CustomerRepository';
import { IEmailBody } from './types';

class CustomerService {
  private repository: CustomerRepository = new CustomerRepository();

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

  async getNews(): Promise<{ data?: News[]; errors: string[] }> {
    try {
      const news = await this.repository.getNews();

      return { data: news, errors: [] };
    } catch (err) {
      console.error('Error retrieving news:', err);

      return { errors: ['Error retrieving news:'] };
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

  async saveOrder(orderData: IEmailBody): Promise<{ errors: string[] }> {
    const { firstName, phone, lastName, productId, status = 'active' } = orderData;

    try {
      await this.repository.saveOrder({
        firstName,
        lastName,
        phone: Number(phone),
        productId: Number(productId),
        date: new Date(),
        status,
      });

      return { errors: [] };
    } catch (err) {
      console.error('Error saving order:', err);

      return { errors: ['Error saving order'] };
    }
  }
}

export default CustomerService;
