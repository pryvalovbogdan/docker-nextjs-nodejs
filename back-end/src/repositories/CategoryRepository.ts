import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category.entity';
import { SubCategory } from '../entities/SubCategory.entity';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getCategoriesWithSubcategories = async (): Promise<{ category: string; subcategories: string[] }[]> => {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .select('category.name', 'category')
      .addSelect('array_agg(DISTINCT category.subCategory)', 'subcategories')
      .groupBy('category.name')
      .getRawMany();

    return categories.map(c => ({
      category: c.category,
      subcategories: c.subcategories.filter((sub: string | null): sub is string => sub !== null),
    }));
  };

  getCategoryByName = async (name: string): Promise<Category | null> => {
    return this.categoryRepository.findOne({ where: { name } });
  };

  async saveCategory(categoryData: Partial<Category>, subCategoryName?: string): Promise<Category> {
    let category = await this.getCategoryByName(categoryData.name!);

    if (!category) {
      category = this.categoryRepository.create({ name: categoryData.name! });
      category = await this.categoryRepository.save(category);
    }

    if (subCategoryName) {
      let subCategory = await this.subCategoryRepository.findOne({
        where: { name: subCategoryName, category: { id: category.id } },
      });

      if (!subCategory) {
        subCategory = this.subCategoryRepository.create({
          name: subCategoryName,
          category,
        });

        await this.subCategoryRepository.save(subCategory);
      }
    }

    return category;
  }
}

export default CategoryRepository;
