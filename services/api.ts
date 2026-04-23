import { Case, Lead, LeadStatus, Product, ScreenType, Solution } from '../types';

const API_BASE = '/api';
const ADMIN_AUTH_STORAGE_KEY = 'ardi_led_admin_auth';

function getStoredAdminAuth(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
}

function getAdminHeaders(): HeadersInit {
  const token = getStoredAdminAuth();
  return token ? { Authorization: `Basic ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch {
      errorText = res.statusText;
    }
    throw new Error(`Ошибка API (${res.status}): ${errorText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  try {
    return await res.json();
  } catch (error) {
    console.error('JSON parsing error', error);
    return undefined as T;
  }
}

async function safeFetch(url: string, options?: RequestInit) {
  try {
    return await fetch(url, options);
  } catch {
    console.error(`Network error while fetching ${url}. Убедитесь, что backend запущен.`);
    throw new Error('Сетевая ошибка. Backend недоступен.');
  }
}

const ensureArray = <T,>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);

const normalizeProduct = (product: Partial<Product> | null | undefined): Product => ({
  id: String(product?.id ?? ''),
  slug: product?.slug ?? '',
  name: product?.name ?? '',
  type: (product?.type ?? ScreenType.INDOOR) as ScreenType,
  purpose: ensureArray(product?.purpose),
  pixelPitch: product?.pixelPitch ?? '',
  brightness: Number(product?.brightness ?? 0),
  refreshRate: Number(product?.refreshRate ?? 0),
  ipRating: product?.ipRating ?? '',
  viewingDistanceMin: Number(product?.viewingDistanceMin ?? 0),
  viewingDistanceMax: Number(product?.viewingDistanceMax ?? 0),
  priceFrom: Number(product?.priceFrom ?? 0),
  shortDescription: product?.shortDescription ?? '',
  fullDescription: product?.fullDescription ?? '',
  images: ensureArray(product?.images),
  isFeatured: Boolean(product?.isFeatured),
  sortOrder: Number(product?.sortOrder ?? 0),
  warranty: Number(product?.warranty ?? 3),
  leadTime: Number(product?.leadTime ?? 15),
});

const normalizeSolution = (solution: Partial<Solution> | null | undefined): Solution => ({
  id: String(solution?.id ?? ''),
  slug: solution?.slug ?? '',
  name: solution?.name ?? '',
  type: (solution?.type ?? ScreenType.INDOOR) as ScreenType,
  width: Number(solution?.width ?? 0),
  height: Number(solution?.height ?? 0),
  area: Number(solution?.area ?? 0),
  pixelPitch: solution?.pixelPitch ?? '',
  brightness: Number(solution?.brightness ?? 0),
  included: ensureArray(solution?.included),
  priceFrom: Number(solution?.priceFrom ?? 0),
  shortDescription: solution?.shortDescription ?? '',
  fullDescription: solution?.fullDescription ?? '',
  warranty: Number(solution?.warranty ?? 3),
  leadTime: Number(solution?.leadTime ?? 15),
  images: ensureArray(solution?.images),
  isFeatured: Boolean(solution?.isFeatured),
  featuredOrder: Number(solution?.featuredOrder ?? 0),
});

const normalizeCase = (caseItem: Partial<Case> | null | undefined): Case => ({
  id: String(caseItem?.id ?? ''),
  slug: caseItem?.slug ?? '',
  title: caseItem?.title ?? '',
  city: caseItem?.city ?? '',
  industry: caseItem?.industry ?? '',
  task: caseItem?.task ?? '',
  solution: caseItem?.solution ?? '',
  specs: ensureArray(caseItem?.specs),
  duration: Number(caseItem?.duration ?? 0),
  result: caseItem?.result ?? '',
  images: ensureArray(caseItem?.images),
  videoUrl: caseItem?.videoUrl,
  testimonial: caseItem?.testimonial,
  isFeatured: Boolean(caseItem?.isFeatured),
  featuredOrder: Number(caseItem?.featuredOrder ?? 0),
});

const normalizeLead = (lead: Partial<Lead> | null | undefined): Lead => ({
  id: String(lead?.id ?? ''),
  createdAt: lead?.createdAt ?? '',
  name: lead?.name ?? '',
  phone: lead?.phone ?? '',
  city: lead?.city ?? '',
  message: lead?.message ?? '',
  pageUrl: lead?.pageUrl ?? '',
  source: lead?.source ?? '',
  productId: lead?.productId,
  solutionId: lead?.solutionId,
  status: (lead?.status ?? LeadStatus.NEW) as LeadStatus,
  managerNote: lead?.managerNote,
});

export const api = {
  setAdminCredentials(username: string, password: string) {
    if (typeof window === 'undefined') {
      return;
    }
    const token = window.btoa(`${username}:${password}`);
    window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, token);
  },

  clearAdminCredentials() {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  },

  hasAdminCredentials(): boolean {
    return Boolean(getStoredAdminAuth());
  },

  verifyAdmin: async (): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/admin/session`, {
      headers: {
        ...getAdminHeaders(),
      },
    });
    await handleResponse<void>(res);
  },

  getProducts: async (): Promise<Product[]> => {
    const res = await safeFetch(`${API_BASE}/products`);
    const data = await handleResponse<unknown>(res);
    return ensureArray(data as Product[]).map(normalizeProduct);
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await safeFetch(`${API_BASE}/products/${slug}`);
    const data = await handleResponse<Product | null>(res);
    return normalizeProduct(data);
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const res = await safeFetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminHeaders(),
      },
      body: JSON.stringify(product),
    });
    const data = await handleResponse<Product | null>(res);
    return normalizeProduct(data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(),
      },
    });
    await handleResponse<void>(res);
  },

  getSolutions: async (): Promise<Solution[]> => {
    const res = await safeFetch(`${API_BASE}/solutions`);
    const data = await handleResponse<unknown>(res);
    return ensureArray(data as Solution[]).map(normalizeSolution);
  },

  createSolution: async (solution: Partial<Solution>): Promise<Solution> => {
    const res = await safeFetch(`${API_BASE}/solutions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminHeaders(),
      },
      body: JSON.stringify(solution),
    });
    const data = await handleResponse<Solution | null>(res);
    return normalizeSolution(data);
  },

  deleteSolution: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/solutions/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(),
      },
    });
    await handleResponse<void>(res);
  },

  getCases: async (): Promise<Case[]> => {
    const res = await safeFetch(`${API_BASE}/cases`);
    const data = await handleResponse<unknown>(res);
    return ensureArray(data as Case[]).map(normalizeCase);
  },

  createCase: async (caseItem: Partial<Case>): Promise<Case> => {
    const res = await safeFetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminHeaders(),
      },
      body: JSON.stringify(caseItem),
    });
    const data = await handleResponse<Case | null>(res);
    return normalizeCase(data);
  },

  deleteCase: async (id: string): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/cases/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(),
      },
    });
    await handleResponse<void>(res);
  },

  getLeads: async (): Promise<Lead[]> => {
    const res = await safeFetch(`${API_BASE}/leads`, {
      headers: {
        ...getAdminHeaders(),
      },
    });
    const data = await handleResponse<unknown>(res);
    return ensureArray(data as Lead[]).map(normalizeLead);
  },

  saveLead: async (lead: Partial<Lead>): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    await handleResponse<void>(res);
  },

  updateLead: async (id: string, updates: Partial<Lead>): Promise<void> => {
    const res = await safeFetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminHeaders(),
      },
      body: JSON.stringify(updates),
    });
    await handleResponse<void>(res);
  },
};
