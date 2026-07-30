import { apiClient, cachedGet } from "../client";
import { clearCache } from "../../utils/cache";

export async function getCohorts(filters = {}) {
  const response = await cachedGet("/api/cohorts", {
    params: filters,
  });
  const data = response.data;
  if (Array.isArray(data)) {
    return { items: data, total: data.length };
  }
  return { items: data?.items ?? [], total: data?.total ?? 0 };
}

export async function createCohort(cohortData) {
  const response = await apiClient.put("/api/cohorts", {
    id: null,
    ...cohortData,
  });
  clearCache();
  return response.data;
}

export async function updateCohort(id, cohortData) {
  const response = await apiClient.put("/api/cohorts", {
    id,
    ...cohortData,
  });
  clearCache();
  return response.data;
}

export async function getCohortById(id) {
  const response = await cachedGet(`/api/cohorts/${id}`);
  return response.data;
}

export async function getCohortGroups(cohortId) {
  const response = await cachedGet(`/api/cohorts/${cohortId}/groups`);
  return response.data;
}

export async function getCohortStages(cohortId) {
  const response = await cachedGet(`/api/cohorts/${cohortId}/stages`);
  return response.data;
}
