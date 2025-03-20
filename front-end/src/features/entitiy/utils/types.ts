export type TabKey = 'orders' | 'products';

export type PaginatedData = {
  pages: Record<number, any[]>;
  totalPages: number;
};
