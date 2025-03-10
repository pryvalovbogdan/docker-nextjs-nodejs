import { fetchWrapper } from './client';

export async function contact(contactData: {
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  contact?: boolean;
}): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const response: { message: string } = await fetchWrapper('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: { 'Content-Type': 'application/json' },
    });

    return { success: true, message: response.message };
  } catch (error) {
    console.error('Contact error:', error, error.message);

    return { success: false, message: 'Contact failed' };
  }
}
