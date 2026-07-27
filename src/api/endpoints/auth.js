import { apiClient } from "../client";

export async function loginUser(email, password) {
  const { data } = await apiClient.post("/api/auth/login", { email, password });
  return data;
}

export async function registerUser(name, email, password, role = "Student") {
  const { data } = await apiClient.post("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get("/api/users/me");
  return data;
}
