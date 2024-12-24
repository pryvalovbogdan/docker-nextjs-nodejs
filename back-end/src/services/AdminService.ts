import { Admin, News, Order, Product } from '../entities';
import AdminRepository from '../repositories/AdminRepository';

class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }

  async login(username: string, password: string): Promise<{ data?: Admin; errors: string[] }> {
    try {
      const admin = await this.repository.findAdminByUsername(username);

      if (admin && admin.passwordHash === password) {
        return { data: admin, errors: [] };
      }

      return { errors: ['Invalid credentials'] };
    } catch (error) {
      console.error('Error in login:', error);

      return { errors: ['Failed to log in admin'] };
    }
  }

  async register(adminData: Admin): Promise<{ data?: Admin | null; errors: string[] }> {
    try {
      const admin = new Admin();

      admin.username = adminData.username;
      admin.passwordHash = adminData.passwordHash;
      admin.adminIp = adminData.adminIp; // Explicitly set adminIp
      console.log('savedAdmin', admin, adminData);

      const savedAdmin = await this.repository.saveAdmin(admin);

      return { data: savedAdmin, errors: [] };
    } catch (error) {
      console.error('Error in register:', error);

      return { errors: ['Failed to register admin'] };
    }
  }

  async getOrders(): Promise<{ data?: Order[] | null; errors: string[] }> {
    try {
      const orders = await this.repository.findOrders();

      return { data: orders, errors: [] };
    } catch (error) {
      console.error('Error in getOrders:', error);

      return { errors: ['Failed to retrieve orders'] };
    }
  }

  async updateOrder(orderId: number, data: Partial<Order>): Promise<{ data?: Order | null; errors: string[] }> {
    try {
      console.log('datatatata', orderId, data);
      const updatedOrder = await this.repository.updateOrder(orderId, data);

      return { data: updatedOrder, errors: [] };
    } catch (error) {
      console.error('Error in updateOrder:', error);

      return { errors: ['Failed to update order'] };
    }
  }

  async deleteOrder(orderId: number): Promise<{ data?: Order | null; errors: string[] }> {
    try {
      const deletedOrder = await this.repository.deleteOrder(orderId);

      return { data: deletedOrder, errors: [] };
    } catch (error) {
      console.error('Error in deleteOrder:', error);

      return { errors: ['Failed to delete order'] };
    }
  }

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

export default AdminService;
