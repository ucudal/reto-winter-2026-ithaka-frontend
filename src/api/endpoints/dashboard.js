import { cachedGet } from "../client";

export async function getDashboardSummary() {
  const response = await cachedGet("/api/dashboard/summary");
  return response.data;
}
