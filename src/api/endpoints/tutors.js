import { apiClient } from "../client";

export async function getTutors() {
  const { data } = await apiClient.get("/api/tutors");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function updateTutor(id, payload) {
  const { data } = await apiClient.put(`/api/tutors/${id}`, payload);
  return data;
}
