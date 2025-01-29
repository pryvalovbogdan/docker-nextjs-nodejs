import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './Order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  characteristics: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];
}
