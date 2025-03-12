import { OrdersApiResponse } from '@/entities/order/model/types';
import { fetchWrapper } from '@/shared/api/client';

export async function createOrder(orderData: {
  name: string;
  email: string;
  productId: number;
  phone: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response: { message: string } = await fetchWrapper('/api/order', {
      method: 'POST',
      body: JSON.stringify({ ...orderData, status: 'active' }),
      headers: { 'Content-Type': 'application/json' },
    });

    return { success: true, message: response.message };
  } catch (error) {
    console.error('Order submission error:', error);

    return { success: false, message: 'Order submission failed' };
  }
}

export async function fetchOrders(token: string, page: number = 1, limit: number = 5) {
  try {
    const response: OrdersApiResponse = await fetchWrapper(`/api/admin/orders?page=${page}&limit=${limit}`, {
      headers: { Authorization: token },
      cache: 'force-cache',
    });

    return {
      success: true,
      message: response.message,
      orders: response.data.orders,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Order fetch error:', error);

    return { success: false, message: 'Order fetch failed' };
  }
}

export async function deleteOrder(token: string, id: string) {
  try {
    const response: OrdersApiResponse = await fetchWrapper(`/api/admin/orders/${id}`, {
      headers: { Authorization: token },
      method: 'DELETE',
    });

    return {
      success: true,
      message: response.message,
      orders: response.data.orders,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Order delete error:', error);

    return { success: false, message: 'Order delete failed' };
  }
}
