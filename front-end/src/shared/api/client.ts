export async function fetchWrapper<T>(url: string, options: any): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  if (contentType?.includes('text/plain')) {
    return response.text() as unknown as T;
  }

  if (contentType?.includes('application/octet-stream')) {
    return response.blob() as unknown as T;
  }

  return response.arrayBuffer() as unknown as T;
}
