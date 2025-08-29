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

  @Column({ type: 'varchar', length: 255, nullable: true })
  heading: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  keywords: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  name_ru: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title_ru: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heading_ru: string | null;

  @Column({ type: 'text', nullable: true })
  description_ru: string | null;

  @Column({ type: 'text', nullable: true })
  keywords_ru: string | null;

  @Column({ type: 'int', default: 10000 })
  position: number;

  @OneToMany(() => SubCategory, subCategory => subCategory.category, { nullable: true })
  subCategories?: SubCategory[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
