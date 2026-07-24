import { cachedGet } from "../client";

export async function getStageExpectedDeliverables(stageId) {
  const response = await cachedGet(
    `/api/stages/${stageId}/expected-deliverables`,
  );
  return response.data;
}
