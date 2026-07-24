import { apiClient } from "../client";

export async function getUsers() {
  const { data } = await apiClient.get("/api/users");
  return data;
}

export async function createUser(payload) {
  const { data } = await apiClient.post("/api/users", payload);
  return data;
}

export async function updateUser(userId, payload) {
  const { data } = await apiClient.put(`/api/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await apiClient.delete(`/api/users/${userId}`);
  return data;
}
