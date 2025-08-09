import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category, SubCategory } from '../entities';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getCategoriesWithSubcategories = async (): Promise<
    { id: number; name: string; subCategories: { id: number; name: string }[] }[]
  > => {
    const rows = await this.categoryRepository.query(`
      SELECT
        c.id,
        c.name,
        c.path,
        COALESCE(sc.subcategories, '[]'::json) AS subcategories
      FROM categories c
      LEFT JOIN LATERAL (
        SELECT json_agg(
                 json_build_object('id', s.id, 'name', s.name, 'path', s.path)
                 ORDER BY s.name
               ) AS subcategories
        FROM subcategories s
        WHERE s.categoryid = c.id
      ) sc ON TRUE;
    `);

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      path: r.path,
      subCategories: r.subcategories ?? [],
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

  getCategoryByPath = async (path: string): Promise<Category | null> => {
    return this.categoryRepository.findOne({ where: { path } });
  };
}

export default CategoryRepository;
