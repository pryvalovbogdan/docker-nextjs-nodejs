import { Category } from '../entities';
import CategoryRepository from '../repositories/CategoryRepository';

class CategoryService {
  private repository: CategoryRepository = new CategoryRepository();

  async getCategory(name: string): Promise<{ data?: Category | null; errors: string[] }> {
    try {
      const category = await this.repository.getCategoryByName(name);

      return { data: category, errors: category ? [] : ['Category not found'] };
    } catch (error) {
      console.error('Error retrieving category:', error);

      return { errors: ['Error retrieving category'] };
    }
  }

  async createCategory(name: string, subCategory?: string): Promise<{ data?: Category; errors: string[] }> {
    try {
      const category = await this.repository.saveCategory({ name }, subCategory);

      return { data: category, errors: [] };
    } catch (error) {
      console.error('Error creating category:', error);

      return { errors: ['Error creating category'] };
    }
  }

  async getCategoriesWithSubcategories(): Promise<{
    data?: { name: string; subCategories: { id: number; name: string }[] }[];
    errors: string[];
  }> {
    try {
      const categories = await this.repository.getCategoriesWithSubcategories();

      return categories.length > 0 ? { data: categories, errors: [] } : { errors: ['No categories found'] };
    } catch (error) {
      console.error('Error retrieving categories:', error);

      return { errors: ['Error retrieving categories'] };
    }
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.repository.deleteCategory(categoryId);
  }
}

export default CategoryService;
