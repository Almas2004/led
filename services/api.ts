
import { Product, Solution, Case, Lead, ScreenType, LeadStatus } from '../types';

// API_BASE указывает на локальный Go-сервер. 
// ВНИМАНИЕ: Если вы запускаете бэкенд на другом порту или сервере, измените этот адрес.
const API_BASE = '/api';

/**
 * Вспомогательная функция для обработки ответов от сервера.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch (e) {
      errorText = res.statusText;
    }
    throw new Error(`Ошибка API (${res.status}): ${errorText}`);
  }

  // Обработка пустого ответа
  if (res.status === 204) {
    return [] as any as T;
  }

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return [] as any as T;
  }

  try {
    return await res.json();
  } catch (e) {
    console.error("JSON parsing error", e);
    return [] as any as T;
  }
}

/**
 * Обертка для fetch с обработкой сетевых ошибок (Backend Offline)
 */
async function safeFetch(url: string, options?: RequestInit) {
  try {
    return await fetch(url, options);
  } catch (e) {
    console.error(`Network Error (fetch failed): ${url}. Убедитесь, что Go-сервер запущен.`);
    throw new Error("Сетевая ошибка. Бэкенд недоступен.");
  }
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const res = await safeFetch(`${API_BASE}/products`);
    return await handleResponse<Product[]>(res);
  },
  
  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await safeFetch(`${API_BASE}/products/${slug}`);
    return await handleResponse<Product>(res);
  },
  
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const res = await safeFetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(res);
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    await handleResponse<void>(res);
  },

  getSolutions: async (): Promise<Solution[]> => {
    const res = await safeFetch(`${API_BASE}/solutions`);
    return await handleResponse<Solution[]>(res);
  },
  
  createSolution: async (solution: Partial<Solution>): Promise<Solution> => {
    const res = await safeFetch(`${API_BASE}/solutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solution)
    });
    return handleResponse<Solution>(res);
  },
  
  deleteSolution: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/solutions/${id}`, { method: 'DELETE' });
    await handleResponse<void>(res);
  },

  getCases: async (): Promise<Case[]> => {
    const res = await safeFetch(`${API_BASE}/cases`);
    return await handleResponse<Case[]>(res);
  },
  
  createCase: async (caseItem: Partial<Case>): Promise<Case> => {
    const res = await safeFetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseItem)
    });
    return handleResponse<Case>(res);
  },
  
  deleteCase: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/cases/${id}`, { method: 'DELETE' });
    await handleResponse<void>(res);
  },

  getLeads: async (): Promise<Lead[]> => {
    const res = await safeFetch(`${API_BASE}/leads`);
    return await handleResponse<Lead[]>(res);
  },
  
  saveLead: async (lead: Partial<Lead>): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    await handleResponse<void>(res);
  },
  
  updateLead: async (id: string, updates: Partial<Lead>): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    await handleResponse<void>(res);
  }
};
