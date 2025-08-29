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

  async createCategory(data: Partial<Category>): Promise<{ data?: Category; errors: string[] }> {
    try {
      if (!data.name) {
        return { errors: ['Name is required'] };
      }

      const category = await this.repository.saveCategory(data);

      return { data: category, errors: [] };
    } catch (error) {
      console.error('Error creating category:', error);

      return { errors: ['Error creating category'] };
    }
  }

  async getCategoriesWithSubcategories(lng: 'uk' | 'ru'): Promise<{
    data?: { name: string; subCategories: { id: number; name: string }[] }[];
    errors: string[];
  }> {
    try {
      const categories = await this.repository.getCategoriesWithSubcategories(lng);

      return categories.length > 0 ? { data: categories, errors: [] } : { errors: ['No categories found'] };
    } catch (error) {
      console.error('Error retrieving categories:', error);

      return { errors: ['Error retrieving categories'] };
    }
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.repository.deleteCategory(categoryId);
  }

  async getCategoryByPath(path: string): Promise<{ data?: Category | null; errors: string[] }> {
    try {
      const category = await this.repository.getCategoryByPath(path);

      return { data: category, errors: category ? [] : ['Category not found'] };
    } catch (error) {
      console.error('Error retrieving category:', error);

      return { errors: ['Error retrieving category'] };
    }
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<{ data?: Category; errors: string[] }> {
    try {
      const exists = await this.repository.getById(id);

      if (!exists) {
        return { errors: ['Category not found'] };
      }

      const updated = await this.repository.updateCategory(id, data);

      return { data: updated, errors: [] };
    } catch (error) {
      console.error('Error updating category:', error);

      return { errors: ['Error updating category'] };
    }
  }
}

export default CategoryService;
