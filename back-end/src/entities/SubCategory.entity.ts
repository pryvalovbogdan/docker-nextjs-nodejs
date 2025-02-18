import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './Category.entity';
import { Product } from './Product.entity';

@Entity('subcategories')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ManyToOne(() => Category, category => category.subCategories, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryid' })
  category: Category;

  @OneToMany(() => Product, product => product.subCategory)
  products: Product[];
}
