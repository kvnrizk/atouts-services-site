// API Configuration and utility functions

const getApiUrl = () => {
  // Server-side: use internal API_URL (no NEXT_PUBLIC_ prefix needed)
  // Client-side: use NEXT_PUBLIC_API_URL
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

export const API_URL = getApiUrl();

// Helper function to handle API errors
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `API Error: ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      // If parsing fails, use the default error message
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    return handleResponse(response);
  },

  async post(endpoint: string, data?: unknown, options?: RequestInit) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse(response);
  },

  async patch(endpoint: string, data?: unknown, options?: RequestInit) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse(response);
  },

  async put(endpoint: string, data?: unknown, options?: RequestInit) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return handleResponse(response);
  },

  async delete(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${getApiUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    return handleResponse(response);
  },
};

// API Endpoints
export const endpoints = {
  quoteRequests: {
    create: '/quote-requests',
    getAll: '/quote-requests',
    getOne: (id: number) => `/quote-requests/${id}`,
    updateStatus: (id: number) => `/quote-requests/${id}/status`,
    delete: (id: number) => `/quote-requests/${id}`,
    stats: '/quote-requests/stats',
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  portfolio: {
    create: '/portfolio',
    getAll: '/portfolio',
    getOne: (id: number) => `/portfolio/${id}`,
    update: (id: number) => `/portfolio/${id}`,
    delete: (id: number) => `/portfolio/${id}`,
    getByCategory: (category: string) => `/portfolio/category/${category}`,
  },
  upload: {
    image: '/upload/image',
  },
  siteImages: '/site-images',
  beforeAfter: {
    create: '/before-after',
    getAll: '/before-after',
    getOne: (id: number) => `/before-after/${id}`,
    update: (id: number) => `/before-after/${id}`,
    delete: (id: number) => `/before-after/${id}`,
    getByCategory: (category: string) => `/before-after/category/${category}`,
  },
  blog: {
    create: '/blog',
    getAll: '/blog',
    getBySlug: (slug: string) => `/blog/${slug}`,
    getByCategory: (category: string) => `/blog/category/${category}`,
    adminAll: '/blog/admin/all',
    update: (id: number) => `/blog/${id}`,
    delete: (id: number) => `/blog/${id}`,
  },
  cityPages: {
    create: '/city-pages',
    getAll: '/city-pages',
    getBySlug: (slug: string) => `/city-pages/${slug}`,
    adminAll: '/city-pages/admin/all',
    update: (id: number) => `/city-pages/${id}`,
    delete: (id: number) => `/city-pages/${id}`,
  },
  testimonials: {
    create: '/testimonials',
    getAll: '/testimonials',
    adminAll: '/testimonials/admin/all',
    update: (id: number) => `/testimonials/${id}`,
    delete: (id: number) => `/testimonials/${id}`,
  },
  priceReferences: {
    create: '/price-references',
    getAll: '/price-references',
    adminAll: '/price-references/admin/all',
    getByCategory: (category: string) => `/price-references/category/${category}`,
    update: (id: number) => `/price-references/${id}`,
    delete: (id: number) => `/price-references/${id}`,
  },
  estimations: {
    calculate: '/estimations/calculate',
    captureContact: (sessionId: string) => `/estimations/${sessionId}/contact`,
    downloadPdf: (sessionId: string) => `/estimations/${sessionId}/pdf`,
    adminAll: '/estimations/admin/all',
    stats: '/estimations/admin/stats',
  },
  projects: {
    create: '/projects',
    adminAll: '/projects/admin/all',
    adminStats: '/projects/admin/stats',
    update: (id: number) => `/projects/${id}`,
    addUpdate: (id: number) => `/projects/${id}/updates`,
    addDocument: (id: number) => `/projects/${id}/documents`,
    my: '/projects/my',
    myOne: (id: number) => `/projects/my/${id}`,
  },
  clientAuth: {
    register: '/auth/client/register',
    login: '/auth/client/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  payments: {
    checkout: '/payments/checkout',
    my: '/payments/my',
    adminAll: '/payments/admin/all',
    adminStats: '/payments/admin/stats',
    refund: (id: number) => `/payments/admin/refund/${id}`,
  },
  newsletter: {
    subscribe: '/newsletter/subscribe',
    unsubscribe: '/newsletter/unsubscribe',
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    revenue: '/analytics/revenue',
    conversions: '/analytics/conversions',
    quoteTrends: '/analytics/quote-trends',
    sources: '/analytics/sources',
    popularServices: '/analytics/popular-services',
    traffic: (days: number) => `/analytics/traffic?days=${days}`,
  },
};
