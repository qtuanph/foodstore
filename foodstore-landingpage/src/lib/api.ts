// API Helper for fetching data from .NET backend at build time
// Base URL: http://api.localhost/v2 (Docker) or http://localhost:5142/v2 (local)

const API_BASE = 'http://api.localhost/v2';

export interface ApiResponse<T> {
  data: T;
  error: null | {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnailUrl?: string;
  status?: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: number;
  viewCount: number;
  isFeatured: boolean;
  author?: {
    id: string;
    name: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} for ${url}`);
      return null as T;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    return null as T;
  }
}

export async function getBlogArticles(page = 1, limit = 10, category?: string, tag?: string): Promise<ApiResponse<BlogPost[]>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  const res = await fetchApi<any>(`/api/public/blog/articles?${params.toString()}`);
  if (res?.data?.data) {
    res.data = res.data.data;
  }
  return res as ApiResponse<BlogPost[]>;
}

export async function getBlogArticle(slug: string): Promise<ApiResponse<BlogPost>> {
  return fetchApi<ApiResponse<BlogPost>>(`/api/public/blog/articles/${slug}`);
}

export async function getFeaturedArticles(limit = 5): Promise<ApiResponse<BlogPost[]>> {
  return fetchApi<ApiResponse<BlogPost[]>>(`/api/public/blog/featured?limit=${limit}`);
}

export async function getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  return fetchApi<ApiResponse<BlogCategory[]>>('/api/public/blog/categories');
}

export async function getBlogTags(): Promise<ApiResponse<BlogTag[]>> {
  return fetchApi<ApiResponse<BlogTag[]>>('/api/public/blog/tags');
}

export interface PublicMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  items: PublicMenuItem[];
}

export async function getMenu(): Promise<ApiResponse<PublicMenuCategory[]>> {
  return fetchApi<ApiResponse<PublicMenuCategory[]>>('/api/public/menu');
}

export interface PublicComboItem {
  name: string;
  quantity: number;
}

export interface PublicCombo {
  id: string;
  name: string;
  description?: string;
  comboPrice: number;
  imageUrl?: string;
  items: PublicComboItem[];
}

export async function getCombos(): Promise<ApiResponse<PublicCombo[]>> {
  return fetchApi<ApiResponse<PublicCombo[]>>('/api/public/combos');
}
