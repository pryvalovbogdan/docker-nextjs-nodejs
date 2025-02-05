import axios, { AxiosRequestConfig } from 'axios';

const REQUEST_CONTENT_TYPE = 'application/json';
const REQUEST_ACCEPT = 'application/json, text/javascript, */*; q=0.01';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common.Accept = REQUEST_ACCEPT;
axios.defaults.headers.post['Content-Type'] = REQUEST_CONTENT_TYPE;

axios.interceptors.response.use(
  response => {
    return response && response.data ? response.data : response;
  },

  error => {
    console.error('HTTP Error:', error);

    return Promise.reject(error);
  },
);

export async function httpGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return axios.get<T>(url, config);
}

export async function httpPut<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return axios.put<T>(url, data, config);
}

export async function httpPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return axios.post<T>(url, data, config);
}

export async function httpDelete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return axios.delete<T>(url, config);
}

export async function httpPatch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return axios.patch<T>(url, data, config);
}
