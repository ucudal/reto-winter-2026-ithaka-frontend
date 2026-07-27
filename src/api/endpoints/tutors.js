import { apiClient, cachedGet } from "../client";

export async function getTutors() {
  const { data } = await apiClient.get("/api/tutors");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function upsertTutor(payload) {
  const { data } = await apiClient.put("/api/tutors", payload);
  return data;
}

export async function getTutorCapacity(id) {
  const { data } = await apiClient.get(`/api/tutors/${id}/capacity`);
  return data;
}

export async function getOverloadedTutors() {
  const response = await cachedGet("/api/tutors/overloaded", {}, 2);
  const data = response.data;
  return Array.isArray(data) ? data : (data?.items ?? []);
}
