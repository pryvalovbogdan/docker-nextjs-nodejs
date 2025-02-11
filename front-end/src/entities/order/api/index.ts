import { fetchWrapper } from '@/shared/api/client';

export async function submitOrder(orderData: {
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
