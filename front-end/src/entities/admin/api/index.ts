import { AdminApiResponse } from '@/entities/admin/model/types';
import { fetchWrapper } from '@/shared/api/client';

export async function login(loginData: {
  username: string;
  passwordHash: string;
}): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const response: { data: { token: string }; message: string } = await fetchWrapper('/api/admin/login', {
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

export async function fetchAdmins(token: string, page: number = 1, limit: number = 5) {
  try {
    const response = (await fetchWrapper(`/api/admin/admins?page=${page}&limit=${limit}`, {
      headers: { Authorization: token },
    })) as AdminApiResponse;

    return {
      success: true,
      message: response.message,
      admins: response.data.admins,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Admin fetch error:', error);

    return { success: false, message: 'Admin fetch failed' };
  }
}

export async function deleteAdmin(token: string, id: string) {
  try {
    const response: AdminApiResponse = await fetchWrapper(`/api/admin/admins/${id}`, {
      headers: { Authorization: token },
      method: 'DELETE',
    });

    return {
      success: true,
      message: response.message,
      admins: response.data.admins,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Admin delete error:', error);

    return { success: false, message: 'Admin delete failed' };
  }
}

export async function createAdmin(token: string, formData: any) {
  try {
    const response: AdminApiResponse = await fetchWrapper('/api/admin/admins', {
      headers: { Authorization: token },
      method: 'POST',
      body: formData,
    });

    return {
      success: true,
      message: response.message,
      admins: response.data.admins,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error('Admin create error:', error);

    return { success: false, message: 'Admin create failed' };
  }
}
