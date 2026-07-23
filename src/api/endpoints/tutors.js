import { apiClient } from "../client";

export async function getTutors() {
  const { data } = await apiClient.get("/tutors");

  return Array.isArray(data) ? data : (data?.items ?? []);
}
