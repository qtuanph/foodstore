import { apiClient } from "@/lib/api-client";
import { cachedFetch, invalidateCachePrefix } from "@/lib/client-cache";
import type { MenuItem, MenuItemCreateDto, MenuItemUpdateDto } from "@/lib/types";
import { authHeaders, type ApiResponse } from "./utils";

export const menuItemService = {
  async getAll(): Promise<MenuItem[]> {
    return cachedFetch("menu-items:all", async () => {
      const res = await apiClient<ApiResponse<MenuItem[]>>("/admin/menu-items", authHeaders());
      return res.data;
    }, 60_000);
  },

  async getById(id: string): Promise<MenuItem> {
    return cachedFetch(`menu-items:${id}`, async () => {
      const res = await apiClient<ApiResponse<MenuItem>>(`/admin/menu-items/${id}`, authHeaders());
      return res.data;
    }, 60_000);
  },

  async create(data: MenuItemCreateDto): Promise<MenuItem> {
    const res = await apiClient<ApiResponse<MenuItem>>("/admin/menu-items", {
      method: "POST", body: JSON.stringify(data), ...authHeaders(),
    });
    invalidateCachePrefix("menu-items:");
    return res.data;
  },

  async update(id: string, data: MenuItemUpdateDto): Promise<void> {
    await apiClient(`/admin/menu-items/${id}`, {
      method: "PUT", body: JSON.stringify(data), ...authHeaders(),
    });
    invalidateCachePrefix("menu-items:");
  },

  async delete(id: string): Promise<void> {
    await apiClient(`/admin/menu-items/${id}`, {
      method: "DELETE", ...authHeaders(),
    });
    invalidateCachePrefix("menu-items:");
  },
};
