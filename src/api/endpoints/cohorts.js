import { apiClient, cachedGet } from "../client";
import { clearCache } from "../../utils/cache";

export async function getCohorts(filters = {}) {
  const response = await cachedGet("/api/cohorts", {
    params: filters,
  });
  return response.data;
}

export async function createCohort(cohortData) {
  const response = await apiClient.post("/api/cohorts", cohortData);
  clearCache("cache_/api/cohorts");
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
