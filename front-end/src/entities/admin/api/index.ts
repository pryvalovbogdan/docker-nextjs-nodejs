import { fetchWrapper } from '@/shared/api/client';

export async function login(loginData: {
  username: string;
  passwordHash: string;
}): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const response = await fetchWrapper('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: { 'Content-Type': 'application/json' },
    });

    return { success: true, message: response.message, token: response.data.token };
  } catch (error) {
    console.error('Login error:', error);

    return { success: false, message: 'Login failed' };
  }
}
