import fs from 'fs';
import path from 'path';

import { AppDataSource } from '../data-source';
import { Category } from '../entities';
import { Product } from '../entities';
import { SubCategory } from '../entities';
import '../prefetched-data/data.json';
import { normalize } from './utils';

const jsonFilePath = path.resolve(__dirname, '../prefetched-data/data.json');

export const importProducts = async () => {
  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const products = JSON.parse(rawData);

    for (const productData of products) {
      const normalizedCategoryName = normalize(productData.category);
      let category = await AppDataSource.manager.findOne(Category, { where: { name: normalizedCategoryName } });

      if (productData.category?.length) {
        if (!category) {
          category = new Category();
          category.name = productData.category;
          category = await AppDataSource.manager.save(category);
        }
      } else {
        category = null;
      }

      let subCategory = await AppDataSource.manager.findOne(SubCategory, { where: { name: productData.subcategory } });

      if (productData?.subcategory?.length) {
        if (category && !subCategory) {
          subCategory = new SubCategory();
          subCategory.name = productData.subcategory;
          subCategory.category = category;
          await AppDataSource.manager.save(subCategory);
        }
      } else {
        subCategory = null;
      }

      const product = new Product();

      product.title = productData.title;
      product.description = productData.description;
      product.characteristics = productData.characteristics;
      product.images = productData.imgUrls || productData.images;
      product.category = category;

      if (subCategory) {
        product.subCategory = subCategory;
      }

      const brand = productData.brandname || productData.brand;

      if (brand) {
        product.brand = brand;
      }

      await AppDataSource.manager.save(product);
      console.log(`Inserted: ${product.title}`);
    }

    console.log('All products inserted successfully.');
  } catch (error) {
    console.error('Error importing products:', error);
  }
};
