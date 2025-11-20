import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Category, SubCategory } from '../entities';
import { FieldsMap, ISebCategoryResponse } from '../utils/types';

class CategoryRepository {
  private categoryRepository: Repository<Category> = AppDataSource.manager.getRepository(Category);

  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  private normalizeLng(lng?: string): 'uk' | 'ru' {
    const s = String(lng || 'uk').toLowerCase();

    return s.startsWith('ru') ? 'ru' : 'uk';
  }

  getCategoriesWithSubcategories = async (lng?: string): Promise<ISebCategoryResponse[]> => {
    const language = this.normalizeLng(lng);

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

    const fieldsByLang = fields[language];

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .orderBy('category.position', 'ASC')
      .addOrderBy('category.id', 'ASC')
      .addOrderBy('subCategory.position', 'ASC')
      .addOrderBy('subCategory.id', 'ASC')
      .getMany();

    return categories.map(category => ({
      id: category.id,
      name: category[fieldsByLang.name] as string,
      path: category.path || '',
      title: category[fieldsByLang.title] as string,
      heading: category[fieldsByLang.heading] as string,
      description: category[fieldsByLang.description] as string,
      keywords: category.keywords,
      position: category.position,
      subCategories:
        category.subCategories?.map(sub => ({
          id: sub.id,
          name: sub[fieldsByLang.name] as string,
          path: sub.path,
          title: sub[fieldsByLang.title] as string,
          heading: sub[fieldsByLang.heading] as string,
          description: sub[fieldsByLang.description] as string,
          keywords: sub.keywords,
          position: sub.position,
        })) || [],
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
