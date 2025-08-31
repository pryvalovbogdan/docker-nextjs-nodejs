import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { SubCategory } from '../entities';

class SubCategoryRepository {
  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  getById = async (id: number): Promise<SubCategory | null> => {
    return this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  };

  async createSubCategoryFull(data: {
    name: string;
    categoryId: number;
    path?: string | null;
    title?: string | null;
    heading?: string | null;
    description?: string | null;
    keywords?: string | null;
    position?: number;
  }): Promise<{ data?: SubCategory | null; errors: string[] }> {
    try {
      const existing = await this.subCategoryRepository.findOne({ where: { name: data.name } });

      if (existing) {
        return { data: existing, errors: [] };
      }

      const sc = this.subCategoryRepository.create({
        name: data.name,
        path: data.path ?? null,
        title: data.title ?? null,
        heading: data.heading ?? null,
        description: data.description ?? null,
        keywords: data.keywords ?? null,
        position: data.position ?? 10000,
        category: { id: data.categoryId } as any,
      });

      const saved = await this.subCategoryRepository.save(sc);

      return { data: saved, errors: [] };
    } catch (error) {
      console.error('Error creating subcategory (full):', error);

      return { errors: ['Failed to create subcategory'] };
    }
  }

  async updateSubCategory(id: number, patch: Partial<SubCategory> & { categoryId?: number }): Promise<SubCategory> {
    const entity = await this.getById(id);

    if (!entity) {
      throw new Error('Subcategory not found');
    }

    if (patch.categoryId !== undefined) {
      (entity as any).category = { id: Number(patch.categoryId) } as any;
      delete (patch as any).categoryId;
    }

    this.subCategoryRepository.merge(entity, patch);

    const saved = await this.subCategoryRepository.save(entity);

    return saved;
  }

  async createSubCategory(name: string, categoryId: number) {
    try {
      const existingSubCategory = await this.subCategoryRepository.findOne({ where: { name } });

      if (existingSubCategory) {
        return { data: existingSubCategory, errors: [] };
      }

      const subCategory = new SubCategory();

      subCategory.name = name;
      subCategory.category = { id: categoryId } as any;

      const savedSubCategory = await this.subCategoryRepository.save(subCategory);

      return { data: savedSubCategory, errors: [] };
    } catch (error) {
      console.error('Error creating subcategory:', error);

      return { errors: ['Failed to create subcategory'] };
    }
  }

  async getSubCategory(name: string): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { name },
      relations: ['category'],
    });
  }

  async getAllSubCategories() {
    try {
      const subCategories = await this.subCategoryRepository.find({ relations: ['category'] });

      if (subCategories.length > 0) {
        return { data: subCategories, errors: [] };
      }

      return { errors: ['No subcategories found'] };
    } catch (error) {
      console.error('Error retrieving subcategories:', error);

      return { errors: ['Error retrieving subcategories'] };
    }
  }

  async deleteSubCategory(subCategoryId: number): Promise<void> {
    await this.subCategoryRepository.delete(subCategoryId);
  }
}

export default SubCategoryRepository;
