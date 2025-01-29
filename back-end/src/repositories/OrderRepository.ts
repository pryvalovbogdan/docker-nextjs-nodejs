import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Order, Product } from '../entities';

class OrderRepository {
  private orderRepository: Repository<Order> = AppDataSource.manager.getRepository(Order);

  private productRepository: Repository<Product> = AppDataSource.manager.getRepository(Product);

  findOrders = async (): Promise<Order[]> => {
    return this.orderRepository.find({ relations: ['product'] });
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
    phone: number;
    productId: number;
    status: string;
    date: Date;
  }): Promise<Order> => {
    const { name, phone, productId, status, date } = orderData;

    const product = await this.productRepository.findOne({ where: { id: productId } });

    console.log('productIdproductIdproductId', productId, product);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const newOrder = this.orderRepository.create({
      name,
      phone,
      date: date.toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
      product, // Pass the full product entity
      status,
    });

    return this.orderRepository.save(newOrder);
  };
}

export default OrderRepository;
