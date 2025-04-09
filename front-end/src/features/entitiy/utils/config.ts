export const dashBoardColumns = {
  orders: [
    { columnName: 'name', translateKey: 'columns.name' },
    { columnName: 'product.title', translateKey: 'tabs.products' },
    { columnName: 'phone', translateKey: 'columns.phone' },
    { columnName: 'email', translateKey: 'columns.email' },
    { columnName: 'date', translateKey: 'columns.date' },
  ],
  products: [
    { columnName: 'title', translateKey: 'columns.title' },
    { columnName: 'description', translateKey: 'columns.description' },
    { columnName: 'characteristics', translateKey: 'columns.characteristics' },
    { columnName: 'brand', translateKey: 'columns.brand' },
    { columnName: 'category', translateKey: 'columns.category' },
    { columnName: 'country', translateKey: 'columns.country' },
    { columnName: 'subCategory', translateKey: 'columns.subcategory' },
  ],
};

export const addEntityDashboardFields: Record<
  'orders' | 'products' | 'admins',
  { name: string; type?: string; required?: boolean; translateKey?: any }[]
> = {
  orders: [
    { name: 'name', required: true },
    { name: 'phone', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'date', type: 'date' },
    { name: 'productId', required: true },
  ],
  products: [
    { name: 'title', required: true, translateKey: 'columns.title' },
    { name: 'description', type: 'textarea', translateKey: 'columns.description' },
    { name: 'characteristics', type: 'textarea', translateKey: 'columns.characteristics' },
    { name: 'brand', translateKey: 'columns.brand' },
    { name: 'category', required: true, translateKey: 'columns.category' },
    { name: 'subCategory', translateKey: 'columns.subcategory' },
    { name: 'country', translateKey: 'columns.country' },
  ],
  admins: [
    { name: 'columns.username', required: true },
    { name: 'columns.password', type: 'password', required: true },
  ],
};
