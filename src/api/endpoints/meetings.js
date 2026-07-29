import { apiClient } from "../client";

function getItems(data) {
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function getMeetings() {
  const { data } = await apiClient.get("/api/meetings");
  return getItems(data);
}

export async function getGroupMeetingTotalHours(groupId) {
  const { data } = await apiClient.get(
    `/api/groups/${groupId}/meetings/total-hours`,
  );
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
  const { data } = await apiClient.put("/api/meetings", {
    id: Number(id),
    ...payload,
  });
  return data;
}

export async function deleteMeeting(id) {
  const { data } = await apiClient.delete(`/api/meetings/${id}`);
  return data;
}
