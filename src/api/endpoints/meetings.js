import { apiClient } from "../client";

export async function getMeetings() {
  const { data } = await apiClient.get("/api/meetings");
  return data;
}

export async function getMeetingById(id) {
  const { data } = await apiClient.get(`/api/meetings/${id}`);
  return data;
}

export async function createMeeting(payload) {
  const { data } = await apiClient.put("/api/meetings", {
    id: null,
    ...payload,
  });
  return data;
}

export async function updateMeeting(id, payload) {
  const { data } = await apiClient.put(`/api/meetings/${id}`, payload);
  return data;
}

export async function deleteMeeting(id) {
  const { data } = await apiClient.delete(`/api/meetings/${id}`);
  return data;
}