// API utility functions for backend communication

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';
};

const getApiUrl = (endpoint: string) => {
  const baseUrl = getBackendUrl();
  return `${baseUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async post(endpoint: string, data?: any, options?: RequestInit) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async put(endpoint: string, data?: any, options?: RequestInit) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async patch(endpoint: string, data?: any, options?: RequestInit) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async delete(endpoint: string, options?: RequestInit) {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Environment configuration
export const config = {
  backendUrl: getBackendUrl(),
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  minioEndpoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
};

