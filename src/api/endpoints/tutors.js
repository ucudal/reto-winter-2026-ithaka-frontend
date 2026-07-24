import { apiClient } from "../client";

export async function getTutors() {
  const { data } = await apiClient.get("/api/tutors");
  return Array.isArray(data) ? data : (data?.items ?? []);
}

export async function upsertTutor(payload) {
  const { data } = await apiClient.put("/api/tutors", payload);
  return data;
}
export const getTutorCapacity = async (id) => {
  const response = await api.get(`/api/tutors/${id}/capacity`);
  return response.data;
};

