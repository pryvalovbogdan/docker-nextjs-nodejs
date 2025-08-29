import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category, SubCategory } from '../entities';
import { FieldsMap, ISebCategoryResponse } from '../utils/types';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getCategoriesWithSubcategories = async (lng: 'uk' | 'ru' = 'uk'): Promise<ISebCategoryResponse[]> => {
    const fields: FieldsMap = {
      ru: {
        name: 'name_ru',
        title: 'title_ru',
        heading: 'heading_ru',
        description: 'description_ru',
        keywords: 'keywords',
      },
      uk: {
        name: 'name',
        title: 'title',
        heading: 'heading',
        description: 'description',
        keywords: 'keywords',
      },
    };

    const fieldsWithTranslates = fields[lng];

    const rows = await this.categoryRepository.query(`
    SELECT
      c.id,
      c.${fieldsWithTranslates.name} AS name,
      c.path,
      c.${fieldsWithTranslates.title} AS title,
      c.${fieldsWithTranslates.heading} AS heading,
      c.${fieldsWithTranslates.description} AS description,
      c.${fieldsWithTranslates.keywords} AS keywords,
      c.position,
      COALESCE(sc.subcategories, '[]'::json) AS subcategories
    FROM categories c
    LEFT JOIN LATERAL (
      SELECT json_agg(
               json_build_object(
                 'id', s.id,
                 'name', s.${fieldsWithTranslates.name},
                 'path', s.path,
                 'title', s.${fieldsWithTranslates.title},
                 'heading', s.${fieldsWithTranslates.heading},
                 'description', s.${fieldsWithTranslates.description},
                 'keywords', s.${fieldsWithTranslates.keywords},
                 'position', s.position
               )
               ORDER BY s.position ASC, s.id ASC
             ) AS subcategories
      FROM subcategories s
      WHERE s.categoryId = c.id
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
      position: r.position,
      subCategories: r.subcategories ?? [],
    }));
  };

  getCategoryByName = async (name: string): Promise<Category | null> => {
    return this.categoryRepository.findOne({ where: { name } });
  };

  async saveCategory(categoryData: Partial<Category>, subCategoryName?: string): Promise<Category> {
    let category = await this.getCategoryByName(categoryData.name!);

    if (!category) {
      category = this.categoryRepository.create(categoryData);
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

  getById = async (id: number): Promise<Category | null> => {
    return this.categoryRepository.findOne({ where: { id } });
  };

  updateCategory = async (id: number, patch: Partial<Category>): Promise<Category> => {
    const entity = await this.getById(id);

    if (!entity) {
      throw new Error('Category not found');
    }

    this.categoryRepository.merge(entity, patch);

    const saved = await this.categoryRepository.save(entity);

    return saved;
  };
}

export default CategoryRepository;
