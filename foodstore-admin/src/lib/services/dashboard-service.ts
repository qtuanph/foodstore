import { apiClient } from "@/lib/api-client";
import { cachedFetch } from "@/lib/client-cache";
import type { Analytics, DashboardStats, Forecast, Recommendation } from "@/lib/types";
import { authHeaders, type ApiResponse } from "./utils";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return cachedFetch("dashboard:stats", async () => {
      const res = await apiClient<ApiResponse<DashboardStats>>("/admin/dashboard/stats", authHeaders());
      return res.data;
    }, 30_000); // cache 30s
  },

  async getAnalytics(fromDate?: string, toDate?: string, groupBy: "day" | "month" = "day"): Promise<Analytics> {
    const params = new URLSearchParams();
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    params.set("groupBy", groupBy);
    const key = `dashboard:analytics:${params.toString()}`;
    return cachedFetch(key, async () => {
      const res = await apiClient<ApiResponse<Analytics>>(`/admin/dashboard/analytics?${params}`, authHeaders());
      return res.data;
    }, 60_000); // cache 1min
  },

  async getForecast(horizon: number = 30): Promise<Forecast> {
    return cachedFetch(`dashboard:forecast:${horizon}`, async () => {
      const res = await apiClient<ApiResponse<Forecast>>(`/admin/dashboard/forecast?horizon=${horizon}`, authHeaders());
      return res.data;
    }, 120_000); // cache 2min
  },

  async getRecommendations(): Promise<Recommendation[]> {
    return cachedFetch("dashboard:recommendations", async () => {
      const res = await apiClient<ApiResponse<Recommendation[]>>("/admin/dashboard/recommendations", authHeaders());
      return res.data;
    }, 60_000); // cache 1min
  },
};
