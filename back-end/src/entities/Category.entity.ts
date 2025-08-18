import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product.entity';
import { SubCategory } from './SubCategory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  path: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => SubCategory, subCategory => subCategory.category, { nullable: true })
  subCategories?: SubCategory[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
