"use client";

// API configuration and helper functions
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://silverstar-server-local.onrender.com/api";
// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token");
  }
  return null;
};

// API helper function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem("admin_token", response.token);
    }

    return response;
  },

  getMe: async () => {
    return apiRequest("/auth/me");
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: () => {
    localStorage.removeItem("admin_token");
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest("/categories");
  },

  getById: async (id: string) => {
    return apiRequest(`/categories/${id}`);
  },

  create: async (categoryData: any) => {
    return apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id: string, categoryData: any) => {
    return apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Menu Items API
export const menuAPI = {
  getAll: async (params?: { category?: string; search?: string; isAvailable?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.isAvailable !== undefined) searchParams.append("isAvailable", params.isAvailable.toString());

    const query = searchParams.toString();
    return apiRequest(`/menu${query ? `?${query}` : ""}`);
  },

  getByCategory: async (categoryId: string) => {
    return apiRequest(`/menu/category/${categoryId}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/menu/${id}`);
  },

  create: async (menuItemData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: menuItemData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  },

  update: async (id: string, menuItemData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: menuItemData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  },

  delete: async (id: string) => {
    return apiRequest(`/menu/${id}`, {
      method: "DELETE",
    });
  },
};

export const restaurantsAPI = {
  getAll: () => fetch("/api/restaurants").then(res => res.json()),
  create: (data: any) => fetch("/api/restaurants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  update: (id: string, data: any) => fetch(`/api/restaurants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  delete: (id: string) => fetch(`/api/restaurants/${id}`, { method: "DELETE" }).then(res => res.json())
}
