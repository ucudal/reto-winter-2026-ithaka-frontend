import { apiClient } from "../client";

export async function getTutors(filters = {}) {
  const { data } = await apiClient.get("/api/tutors", { params: filters });
  if (Array.isArray(data)) {
    return { items: data, total: data.length };
  }
  return { items: data?.items ?? [], total: data?.total ?? 0 };
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

export async function deleteTutor(tutor) {
  const { data } = await apiClient.put("/api/tutors", {
    id: tutor.id,
    name: tutor.name,
    role: tutor.role,
    specialty: tutor.specialty ?? null,
    availability: tutor.availability ?? null,
    status: "Inactive",
    max_capacity: tutor.max_capacity,
    linkedin_url: tutor.linkedin_url ?? null,
  });
  return data;
}

