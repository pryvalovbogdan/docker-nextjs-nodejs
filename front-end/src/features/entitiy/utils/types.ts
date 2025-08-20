export type TabKey = 'orders' | 'products' | 'categories' | 'subcategories';

export type PaginatedData = {
  pages: Record<number, any[]>;
  totalPages: number;
};
