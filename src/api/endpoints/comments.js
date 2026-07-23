import { apiClient } from "../client";

export async function getDeliverableComments(deliverableId) {
  const { data } = await apiClient.get(
    `/api/deliverables/${deliverableId}/comments`,
  );
  return data;
}

export async function createDeliverableComment(deliverableId, payload) {
  const { data } = await apiClient.post(
    `/api/deliverables/${deliverableId}/comments`,
    payload,
  );
  return data;
}

export async function deleteComment(id) {
  const { data } = await apiClient.delete(`/api/comments/${id}`);
  return data;
}
