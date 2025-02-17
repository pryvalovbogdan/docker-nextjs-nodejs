import { Repository } from 'typeorm';

import { AppDataSource } from '../data-source';
import { SubCategory } from '../entities/SubCategory.entity';

class SubCategoryRepository {
  private subCategoryRepository: Repository<SubCategory> = AppDataSource.manager.getRepository(SubCategory);

  async createSubCategory(name: string, categoryId: number): Promise<{ data?: SubCategory | null; errors: string[] }> {
    try {
      const existingSubCategory = await this.subCategoryRepository.findOne({
        where: { name },
      });

      if (existingSubCategory) {
        return { data: existingSubCategory, errors: [] };
      }

      const subCategory = new SubCategory();

      subCategory.name = name;
      subCategory.category = { id: categoryId } as any; // Assign category by reference

      const savedSubCategory = await this.subCategoryRepository.save(subCategory);

      return { data: savedSubCategory, errors: [] };
    } catch (error) {
      console.error('Error creating subcategory:', error);

      return { errors: ['Failed to create subcategory'] };
    }
  }

  async getSubCategory(name: string): Promise<{ data?: SubCategory | null; errors: string[] }> {
    try {
      const subCategory = await this.subCategoryRepository.findOne({
        where: { name },
        relations: ['category'],
      });

      if (subCategory) {
        return { data: subCategory, errors: [] };
      } else {
        return { errors: ['Subcategory not found'] };
      }
    } catch (error) {
      console.error('Error retrieving subcategory:', error);

      return { errors: ['Error retrieving subcategory'] };
    }
  }

  async getAllSubCategories(): Promise<{ data?: SubCategory[]; errors: string[] }> {
    try {
      const subCategories = await this.subCategoryRepository.find({
        relations: ['category'],
      });

      if (subCategories.length > 0) {
        return { data: subCategories, errors: [] };
      } else {
        return { errors: ['No subcategories found'] };
      }
    } catch (error) {
      console.error('Error retrieving subcategories:', error);

      return { errors: ['Error retrieving subcategories'] };
    }
  }
}

export default SubCategoryRepository;
