import { SubCategory } from '../entities';
import SubCategoryRepository from '../repositories/SubCategoryRepository';

class SubCategoryService {
  private repository: SubCategoryRepository = new SubCategoryRepository();

  async createSubCategoryFull(data: {
    name: string;
    categoryId: number;
    path?: string | null;
    title?: string | null;
    heading?: string | null;
    description?: string | null;
    keywords?: string | null;
    position?: number;
    name_ru?: string | null;
    title_ru?: string | null;
    heading_ru?: string | null;
    description_ru?: string | null;
  }): Promise<{ data?: SubCategory | null; errors: string[] }> {
    try {
      const created = await this.repository.createSubCategoryFull(data);

      return created;
    } catch (e) {
      console.error('Error creating subcategory (full):', e);

      return { errors: ['Failed to create subcategory'] };
    }
  }

  async updateSubCategory(
    id: number,
    patch: Partial<SubCategory> & { categoryId?: number },
  ): Promise<{ data?: SubCategory; errors: string[] }> {
    try {
      const exists = await this.repository.getById(id);

      if (!exists) {
        return { errors: ['Subcategory not found'] };
      }

      const updated = await this.repository.updateSubCategory(id, patch);

      return { data: updated, errors: [] };
    } catch (e) {
      console.error('Error updating subcategory:', e);

      return { errors: ['Error updating subcategory'] };
    }
  }

  async createSubCategory(name: string, categoryId: number) {
    return this.repository.createSubCategory(name, categoryId);
  }

  async getSubCategory(name: string): Promise<{ data?: SubCategory | null; errors: string[] }> {
    try {
      const subCategory: SubCategory | null = await this.repository.getSubCategory(name);

      return { data: subCategory, errors: subCategory ? [] : ['Category not found'] };
    } catch (error) {
      console.error('Error retrieving category:', error);

      return { errors: ['Error retrieving category'] };
    }
  }

  async getAllSubCategories() {
    return this.repository.getAllSubCategories();
  }

  async deleteSubCategory(subCategoryId: number) {
    await this.repository.deleteSubCategory(subCategoryId);
  }
}

export default SubCategoryService;
