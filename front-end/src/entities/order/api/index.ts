import { fetchWrapper } from '@/shared/api/client';

export async function submitOrder(orderData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchWrapper('/api/order', {
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
