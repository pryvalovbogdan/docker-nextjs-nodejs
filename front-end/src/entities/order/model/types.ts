export interface Order {
  id: number;
  name: string;
  phone: number;
  date: string;
  email: string;
  status: string;
  product?: {
    id: number;
    title: string;
  };
}

export interface OrdersApiResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    totalPages: number;
  };
}
