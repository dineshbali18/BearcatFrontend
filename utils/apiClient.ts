export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = (data as any)?.message || `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data as T;
  } catch (err) {
    console.error('API request error:', err);
    throw err;
  }
}
