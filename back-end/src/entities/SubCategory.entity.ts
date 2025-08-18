import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './Category.entity';
import { Product } from './Product.entity';

@Entity('subcategories')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  path: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heading: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  keywords: string | null;

  @Column({ type: 'int', default: 10000 })
  position: number;

  @ManyToOne(() => Category, category => category.subCategories, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryid' })
  category: Category;

  @OneToMany(() => Product, product => product.subCategory)
  products: Product[];
}
