import { apiClient } from "../client";

export async function getTutors() {
  const { data } = await apiClient.get("/api/tutors");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function getTutor(id) {
  const { data } = await apiClient.get(`/api/tutors/${id}`);
  return data;
}

export async function getTutorCapacity(id) {
  const { data } = await apiClient.get(`/api/tutors/${id}/capacity`);
  return data;
}

export async function getTutorGroups(id) {
  const { data } = await apiClient.get(`/api/tutors/${id}/groups`);
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function getOverloadedTutors() {
  const { data } = await apiClient.get("/api/tutors/overloaded");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function upsertTutor(payload) {
  const { data } = await apiClient.put("/api/tutors", payload);
  return data;
}

