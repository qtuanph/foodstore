import { apiClient } from "@/lib/api-client";
import { cachedFetch, invalidateCachePrefix } from "@/lib/client-cache";
import type { Category, CategoryCreateDto, CategoryUpdateDto } from "@/lib/types";
import { authHeaders, type ApiResponse } from "./utils";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return cachedFetch("categories:all", async () => {
      const res = await apiClient<ApiResponse<Category[]>>("/admin/categories", authHeaders());
      return res.data;
    }, 60_000);
  },

  async getById(id: string): Promise<Category> {
    return cachedFetch(`categories:${id}`, async () => {
      const res = await apiClient<ApiResponse<Category>>(`/admin/categories/${id}`, authHeaders());
      return res.data;
    }, 60_000);
  },

  async create(data: CategoryCreateDto): Promise<Category> {
    const res = await apiClient<ApiResponse<Category>>("/admin/categories", {
      method: "POST", body: JSON.stringify(data), ...authHeaders(),
    });
    invalidateCachePrefix("categories:");
    return res.data;
  },

  async update(id: string, data: CategoryUpdateDto): Promise<void> {
    await apiClient(`/admin/categories/${id}`, {
      method: "PUT", body: JSON.stringify(data), ...authHeaders(),
    });
    invalidateCachePrefix("categories:");
  },

  async delete(id: string): Promise<void> {
    await apiClient(`/admin/categories/${id}`, {
      method: "DELETE", ...authHeaders(),
    });
    invalidateCachePrefix("categories:");
  },
};
