import { Request, Response } from 'express';

import { ProductService } from '../services';
import S3Service from '../services/S3Service';
import responseHandler from '../utils/responseHandler';
import { tOpenAI } from '../utils/tOpenAi';
import { File } from '../utils/types';
import { isEmpty, randomImageName } from '../utils/utils';

class ProductController {
  private service: ProductService = new ProductService();

  private s3Service = new S3Service();

  addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as File[];
      const imageKeys: string[] = [];

      if (files?.length) {
        for (let file of files) {
          const imageKey = randomImageName();

          await this.s3Service.uploadFileS3(imageKey, file.buffer, file.mimetype);
          imageKeys.push(process.env.CLOUDFRONT_URL! + imageKey);
        }

        req.body.images = imageKeys;
      }

      const category = JSON.parse(req.body.category);
      const subCategory = req.body.subCategory ? JSON.parse(req.body.subCategory) : null;

      const result = await this.service.addProduct({
        ...req.body,
        category,
        subCategory,
      });

      if (result.errors.length) {
        responseHandler.sendCatchResponse(res, result.errors[0]);

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Product added successfully', result.data);
    } catch (error) {
      console.error('Error adding product:', error);
      responseHandler.sendCatchResponse(res, 'Failed to add product');
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const parseMaybeJSON = (v: any) => {
      if (typeof v !== 'string') {
        return v;
      }

      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    };

    const category = parseMaybeJSON(req.body.category);
    const subCategory = req.body.subCategory ? parseMaybeJSON(req.body.subCategory) : null;

    const files = req.files as File[] | undefined;
    const imageKeys: string[] = [];

    if (files?.length) {
      for (const file of files) {
        const imageKey = randomImageName();

        await this.s3Service.uploadFileS3(imageKey, file.buffer, file.mimetype);
        imageKeys.push(process.env.CLOUDFRONT_URL! + imageKey);
      }

      req.body.images = imageKeys;
    } else if (req.body.images !== undefined) {
      if (typeof req.body.images === 'string') {
        try {
          const parsed = JSON.parse(req.body.images);

          req.body.images = Array.isArray(parsed) ? parsed : [req.body.images];
        } catch {
          req.body.images = req.body.images
            .split('|')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
    }

    const product = {
      ...req.body,
      category,
      subCategory,
    };

    const result = await this.service.updateProduct(Number(id), product);

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product updated successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const existingProduct = await this.service.getProductById(Number(id));

    if (existingProduct.data?.images?.length) {
      for (let image of existingProduct.data.images) {
        await this.s3Service.deleteFileS3(image);
      }
    }

    const result = await this.service.deleteProduct(Number(id));

    if (result.errors.length) {
      responseHandler.sendFailResponse(res, result.errors.join(', '));

      return;
    }

    if (result.data) {
      responseHandler.sendSuccessResponse(res, 'Product deleted successfully', result.data);
    } else {
      responseHandler.sendFailResponse(res, 'Product not found');
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getProducts();

      if (result.errors.length || !result.data) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      for (let product of result.data) {
        if (product.images) {
          product.images = product.images.map(item => process.env.CLOUDFRONT_URL + item);
        }
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsOffset = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, lng = 'uk' } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const lngStr = Array.isArray(lng) ? lng[0] : String(lng || 'uk');

    try {
      const result = await this.service.getProductsOffset(limitNumber, pageNumber);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      let products = result.data?.products ?? [];
      const totalPages = result.data?.totalPages ?? 0;

      if (lngStr === 'ru' && products.length) {
        // pick items needing ru title
        const needRu = products.filter(p => isEmpty(p.title_ru) && !isEmpty(p.title));

        console.log('needRu', needRu);

        if (needRu.length) {
          try {
            // translate all needed titles
            const translated = await Promise.all(needRu.map(p => tOpenAI(String(p.title), 'uk', 'ru').catch(() => '')));

            console.log('translated', translated);
            // id -> translated title_ru
            const ruById = new Map<number, string>();

            translated.forEach((val, i) => {
              if (!isEmpty(val)) {
                ruById.set(Number(needRu[i].id), val);
              }
            });

            // persist to DB
            await Promise.all(
              Array.from(ruById.entries()).map(([id, title_ru]) => this.service.updateProduct(id, { title_ru } as any)),
            );

            // rebuild products array with fresh ru titles
            products = products.map(p => {
              const ru = ruById.get(Number(p.id));

              return ru ? { ...p, title_ru: ru } : p;
            });

            console.log('productsproducts', products);
          } catch (e) {
            console.error('RU title translation/persist failed for page', pageNumber, e);
            // still return whatever we have
          }
        }
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', {
        products,
        totalPages,
      });
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const lngRaw = req.query?.lng as string | string[] | undefined;
    const lng = Array.isArray(lngRaw) ? lngRaw[0] : lngRaw;

    try {
      const productId = parseInt(id, 10);
      const result = await this.service.getProductById(productId);

      if (result.errors.length || !result.data) {
        responseHandler.sendFailResponse(res, result.errors.join(', ') || 'Product not found');

        return;
      }

      let data = result.data;

      if (lng !== 'ru') {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', data);

        return;
      }

      type RuKey = 'title_ru' | 'country_ru' | 'description_ru' | 'characteristics_ru';
      type BaseKey = 'title' | 'country' | 'description' | 'characteristics';

      const SPECS: Array<{
        base: BaseKey;
        ru: RuKey;
        fn: (text: string, from: string, to: string) => Promise<string>;
      }> = [
        { base: 'title', ru: 'title_ru', fn: tOpenAI },
        { base: 'country', ru: 'country_ru', fn: tOpenAI },
        { base: 'description', ru: 'description_ru', fn: tOpenAI },
        { base: 'characteristics', ru: 'characteristics_ru', fn: tOpenAI },
      ];

      const requestToTranslate = SPECS.filter(item => isEmpty(data[item.ru]) && !isEmpty(data[item.base]));
      const mapToRequest = requestToTranslate.map(item => {
        return item.fn.apply(null, [data[item.base] || '', 'uk', 'ru']);
      });

      const results = await Promise.all(mapToRequest);

      const updates: Partial<typeof data> = {};

      results.forEach((item, i) => {
        updates[requestToTranslate[i].ru] = item;
      });

      if (Object.keys(updates).length > 0) {
        const saveRes = await this.service.updateProduct(productId, updates as any);

        if (saveRes.errors.length) {
          console.error('Failed to persist RU translations:', saveRes.errors.join(', '));
        }

        data = {
          ...data,
          ...updates,
        };
      }

      responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', data);
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    let { category } = req.params;
    const lngRaw = req.query?.lng as string | string[] | undefined;
    const lng = Array.isArray(lngRaw) ? lngRaw[0] : String(lngRaw || 'uk');

    try {
      category = decodeURIComponent(category);

      const result = await this.service.getProductsByCategory(category);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      let products = result.data ?? [];

      if (lng === 'ru' && products.length) {
        // pick items needing ru title
        const needRu = products.filter(p => isEmpty(p.title_ru) && !isEmpty(p.title));

        if (needRu.length) {
          try {
            // translate all needed titles
            const translated = await Promise.all(needRu.map(p => tOpenAI(String(p.title), 'uk', 'ru').catch(() => '')));

            // id -> translated title_ru
            const ruById = new Map<number, string>();

            translated.forEach((val, i) => {
              if (!isEmpty(val)) {
                ruById.set(Number(needRu[i].id), val);
              }
            });

            // persist to DB
            await Promise.all(
              Array.from(ruById.entries()).map(([id, title_ru]) => this.service.updateProduct(id, { title_ru } as any)),
            );

            // rebuild products array with fresh ru titles
            products = products.map(p => {
              const ru = ruById.get(Number(p.id));

              return ru ? { ...p, title_ru: ru } : p;
            });
          } catch (e) {
            console.error('RU title translation/persist failed for category', category, e);
            // continue with whatever we have
          }
        }
      }

      if (products.length) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', products);
      } else {
        responseHandler.sendFailResponse(res, 'No products found for this category');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by category');
    }
  };

  getProductsBySubCategory = async (req: Request, res: Response): Promise<void> => {
    let { category } = req.params;
    const lngRaw = req.query?.lng as string | string[] | undefined;
    const lng = Array.isArray(lngRaw) ? lngRaw[0] : String(lngRaw || 'uk');

    try {
      category = decodeURIComponent(category);

      const result = await this.service.getProductsBySubCategory(category);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      let products = result.data ?? [];

      if (lng === 'ru' && products.length) {
        // Items that need RU title and have a base title to translate
        const needRu = products.filter(p => isEmpty(p.title_ru) && !isEmpty(p.title));

        if (needRu.length) {
          try {
            // Translate titles in parallel
            const translated = await Promise.all(needRu.map(p => tOpenAI(String(p.title), 'uk', 'ru').catch(() => '')));

            // Map: id -> translated title_ru
            const ruById = new Map<number, string>();

            translated.forEach((val, i) => {
              if (!isEmpty(val)) {
                ruById.set(Number(needRu[i].id), val);
              }
            });

            // Persist to DB
            await Promise.all(
              Array.from(ruById.entries()).map(([id, title_ru]) => this.service.updateProduct(id, { title_ru } as any)),
            );

            // Rebuild array with fresh RU titles for the response
            products = products.map(p => {
              const ru = ruById.get(Number(p.id));

              return ru ? { ...p, title_ru: ru } : p;
            });
          } catch (e) {
            console.error('RU title translation/persist failed for subcategory', category, e);
            // Continue and return whatever we have
          }
        }
      }

      if (products.length) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', products);
      } else {
        responseHandler.sendFailResponse(res, 'No products found for this subcategory');
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by subcategory');
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getCategories();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Categories retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying categories:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  getProductsByBrandName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;

    try {
      const result = await this.service.getProductByBrandName(name);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      if (result.data) {
        responseHandler.sendSuccessResponse(res, 'Product data retrieved successfully', result.data);
      }
    } catch (err) {
      console.error('Error querying products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Error retrieving products by brand name');
    }
  };

  getLastAddedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.getLastAddedProducts();

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Last 10 products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error retrieving last 10 products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.params;
    const queryWithSpaces = query.replace('+', ' ');

    try {
      const result = await this.service.searchProducts(queryWithSpaces);

      if (result.errors.length) {
        responseHandler.sendFailResponse(res, result.errors.join(', '));

        return;
      }

      responseHandler.sendSuccessResponse(res, 'Products retrieved successfully', result.data);
    } catch (err) {
      console.error('Error searching for products:', (err as Error).message);
      responseHandler.sendCatchResponse(res, 'Database error');
    }
  };

  exportProductsCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, filename } = await this.service.exportProductsToCSV();

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/csv');
      res.send(data);
    } catch (error) {
      console.error('Error exporting products:', error);
      responseHandler.sendCatchResponse(res, 'Failed to export products');
    }
  };

  exportProductsJSON = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, filename } = await this.service.exportProductsToJSON();

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(data);
    } catch (error) {
      console.error('Error exporting products (JSON):', error);
      responseHandler.sendCatchResponse(res, 'Failed to export products (JSON)');
    }
  };
}

export default ProductController;
