import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Order, Product } from '../entities';

class OrderRepository {
  private orderRepository: Repository<Order> = AppDataSource.manager.getRepository(Order);

  private productRepository: Repository<Product> = AppDataSource.manager.getRepository(Product);

  findOrders = async (page: number = 1, limit: number = 10): Promise<{ data: Order[]; totalPages: number }> => {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['product'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return { data: orders, totalPages };
  };

  updateOrder = async (orderId: number, data: Partial<Order>): Promise<Order | null> => {
    await this.orderRepository.update(orderId, data);

    return this.orderRepository.findOne({ where: { id: orderId } });
  };

  deleteOrder = async (orderId: number): Promise<Order | null> => {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (order) {
      await this.orderRepository.remove(order);
    }

    return order;
  };

  saveOrder = async (orderData: {
    name: string;
    phone: string;
    productId: number;
    status: string;
    email: string;
    date: Date;
  }): Promise<Order> => {
    const { name, phone, productId, status, date, email } = orderData;

    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const newOrder = this.orderRepository.create({
      name,
      phone,
      date: date.toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
      product,
      email,
      status,
    });

    return this.orderRepository.save(newOrder);
  };
}

export default OrderRepository;
