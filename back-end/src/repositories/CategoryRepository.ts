import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category, SubCategory } from '../entities';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getCategoriesWithSubcategories = async (): Promise<
    { id: number; name: string; subCategories: { id: number; name: string }[] }[]
  > => {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.subCategories', 'subCategory')
      .select(['category.id', 'category.name'])
      .addSelect(
        "COALESCE(json_agg(DISTINCT jsonb_build_object('id', subCategory.id, 'name', subCategory.name)) FILTER (WHERE subCategory.id IS NOT NULL), '[]')",
        'subcategories',
      )
      .groupBy('category.id, category.name')
      .getRawMany();

    return categories.map(c => ({
      id: c.category_id,
      name: c.category_name,
      subCategories: c.subcategories ? c.subcategories : [],
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

  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}

export default CategoryRepository;
