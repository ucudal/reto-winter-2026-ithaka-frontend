import { apiClient } from "../client";

export async function getCohorts() {
  const response = await apiClient.get("/api/cohorts");
  return response.data;
}

export async function createCohort(cohortData) {
  const response = await apiClient.post("/api/cohorts", cohortData);
  return response.data;
}

export async function getCohortById(id) {
  const response = await apiClient.get(`/api/cohorts/${id}`);
  return response.data;
}

export async function getCohortGroups(cohortId) {
  const response = await apiClient.get(`/api/cohorts/${cohortId}/groups`);
  return response.data;
}

export async function getCohortStages(cohortId) {
  const response = await apiClient.get(`/api/cohorts/${cohortId}/stages`);
  return response.data;
}
