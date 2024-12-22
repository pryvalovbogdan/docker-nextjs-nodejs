import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'int' })
  phone: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @ManyToOne(() => Product, product => product.orders, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
