import { apiClient } from "../client";

export async function loginUser(email, password) {
  const { data } = await apiClient.post("/api/auth/login", { email, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("/api/users/me");
  return data;
}
