import { SubCategory } from '../entities';
import SubCategoryRepository from '../repositories/SubCategoryRepository';

class SubCategoryService {
  private repository: SubCategoryRepository = new SubCategoryRepository();

  async createSubCategory(name: string, categoryId: number): Promise<{ data?: SubCategory | null; errors: string[] }> {
    return this.repository.createSubCategory(name, categoryId);
  }

  async getSubCategory(name: string): Promise<{ data?: SubCategory | null; errors: string[] }> {
    return this.repository.getSubCategory(name);
  }

  async getAllSubCategories(): Promise<{ data?: SubCategory[]; errors: string[] }> {
    return this.repository.getAllSubCategories();
  }

  async deleteSubCategory(subCategoryId: number): Promise<void> {
    await this.repository.deleteSubCategory(subCategoryId);
  }
}

export default SubCategoryService;
