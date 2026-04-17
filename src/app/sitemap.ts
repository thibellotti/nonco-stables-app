import type { MetadataRoute } from "next";

const BASE_URL = "https://stables.nonco.com";
const now = new Date();

const routes = [
  { path: "/", priority: 1, frequency: "monthly" },
  { path: "/login", priority: 0.5, frequency: "monthly" },
  { path: "/dashboard", priority: 0.9, frequency: "daily" },
  { path: "/fx", priority: 0.9, frequency: "daily" },
  { path: "/payments", priority: 0.8, frequency: "daily" },
  { path: "/trades", priority: 0.8, frequency: "daily" },
  { path: "/settlements", priority: 0.8, frequency: "daily" },
  { path: "/bridge", priority: 0.7, frequency: "weekly" },
  { path: "/yield", priority: 0.7, frequency: "weekly" },
  { path: "/bank", priority: 0.7, frequency: "weekly" },
  { path: "/onchain", priority: 0.7, frequency: "weekly" },
  { path: "/onchain-activity", priority: 0.7, frequency: "weekly" },
  { path: "/reports", priority: 0.6, frequency: "weekly" },
  { path: "/rfq", priority: 0.6, frequency: "weekly" },
  { path: "/api-keys", priority: 0.4, frequency: "monthly" },
  { path: "/third-party", priority: 0.4, frequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, frequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: frequency,
    priority,
  }));
}
