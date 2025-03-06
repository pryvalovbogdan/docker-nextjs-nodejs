import fs from 'fs';
import path from 'path';

import { AppDataSource } from '../data-source';
import { Category } from '../entities';
import { Product } from '../entities';
import { SubCategory } from '../entities';
import '../prefetched-data/data.json';

const jsonFilePath = path.resolve(__dirname, '../prefetched-data/data.json');

export const importProducts = async () => {
  try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const products = JSON.parse(rawData);

    for (const productData of products) {
      console.log(`Processing product: ${productData.title}`);

      let category = await AppDataSource.manager.findOne(Category, { where: { name: productData.category } });

      if (!category) {
        category = new Category();
        category.name = productData.category;
        await AppDataSource.manager.save(category);
      }

      let subCategory = await AppDataSource.manager.findOne(SubCategory, { where: { name: productData.subcategory } });

      if (!subCategory) {
        subCategory = new SubCategory();
        subCategory.name = productData.subcategory;
        subCategory.category = category;
        await AppDataSource.manager.save(subCategory);
      }

      const product = new Product();

      product.title = productData.title;
      product.description = productData.description;
      product.characteristics = productData.characteristics;
      product.images = productData.imgUrls;
      product.category = category;
      product.subCategory = subCategory;

      if (productData.brandname) {
        product.brand = productData.brandname;
      }

      await AppDataSource.manager.save(product);
      console.log(`Inserted: ${product.title}`);
    }

    console.log('All products inserted successfully.');
  } catch (error) {
    console.error('Error importing products:', error);
  }
};
