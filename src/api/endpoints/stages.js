import { cachedGet, apiClient } from "../client";

export async function getStages() {
  const response = await cachedGet("/api/stages");
  return response.data;
}

export async function upsertStage(payload) {
  const { data } = await apiClient.put("/api/stages", payload);
  return data;
}

export async function getStageExpectedDeliverables(stageId) {
  const response = await cachedGet(
    `/api/stages/${stageId}/expected-deliverables`,
  );
  return response.data;
}
