import { apiClient, cachedGet } from "../client";

export async function getTutors() {
  const response = await cachedGet("/api/tutors");
  return response.data;
}

export async function getTutorById(id) {
  const response = await cachedGet(`/api/tutors/${id}`);
  return response.data;
}

export async function getTutorCapacity(id) {
  const response = await apiClient.get(`/api/tutors/${id}/capacity`);
  return response.data;
}
