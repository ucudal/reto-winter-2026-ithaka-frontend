import { apiClient } from "../client";
import { clearCache } from "../../utils/cache";

function mapDeliverable(raw) {
  return {
    id: raw.id,
    groupId: raw.group_id,
    stageId: raw.stage_id,
    stageName: raw.stage_name,
    expectedDate: raw.expected_date,
    status: raw.status,
  };
}

export async function updateDeliverable(id, payload) {
  const response = await apiClient.put("/api/deliverables", { id, ...payload });
  clearCache();
  return mapDeliverable(response.data);
}
