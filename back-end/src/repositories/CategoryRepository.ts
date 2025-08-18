import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category, SubCategory } from '../entities';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getCategoriesWithSubcategories = async (): Promise<
    {
      id: number;
      name: string;
      path: string | null;
      title: string | null;
      heading: string | null;
      description: string | null;
      keywords: string | null;
      subCategories: {
        id: number;
        name: string;
        path: string | null;
        title: string | null;
        heading: string | null;
        description: string | null;
        keywords: string | null;
      }[];
    }[]
  > => {
    const rows = await this.categoryRepository.query(`
    SELECT
      c.id,
      c.name,
      c.path,
      c.title,
      c.heading,
      c.description,
      c.keywords,
      COALESCE(sc.subcategories, '[]'::json) AS subcategories
    FROM categories c
    LEFT JOIN LATERAL (
      SELECT json_agg(
               json_build_object(
                 'id', s.id,
                 'name', s.name,
                 'path', s.path,
                 'title', s.title,
                 'heading', s.heading,
                 'description', s.description,
                 'keywords', s.keywords
               )
               ORDER BY s.position ASC, s.id ASC
             ) AS subcategories
      FROM subcategories s
      WHERE s.categoryid = c.id
    ) sc ON TRUE
    ORDER BY c.position ASC, c.id ASC;
  `);

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      path: r.path,
      title: r.title,
      heading: r.heading,
      description: r.description,
      keywords: r.keywords,
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
