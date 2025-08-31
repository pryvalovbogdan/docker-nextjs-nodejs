import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './Category.entity';
import { Order } from './Order.entity';
import { SubCategory } from './SubCategory.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'title_ru' })
  title_ru?: string;

  @Column({ type: 'text', nullable: true, name: 'description_ru' })
  description_ru?: string;

  @Column({ type: 'text', nullable: true, name: 'characteristics_ru' })
  characteristics_ru?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'country_ru' })
  country_ru?: string;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({ name: 'categoryid' })
  category: Category | null;

  @ManyToOne(() => SubCategory, subCategory => subCategory.products, { nullable: true })
  @JoinColumn({ name: 'subcategoryid' })
  subCategory?: SubCategory;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];
}
