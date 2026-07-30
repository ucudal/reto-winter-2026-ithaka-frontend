import { apiClient } from "../client";

export async function getMaterials(filters = {}) {
  const response = await apiClient.get("/api/materials", { params: filters });
  const data = response.data;
  if (Array.isArray(data)) {
    return { items: data, total: data.length };
  }
  return { items: data?.items ?? [], total: data?.total ?? 0 };
}

export async function getMaterialById(id) {
  const res = await getMaterials();
  const materials = res?.items ?? [];
  return materials.find((material) => String(material.id) === String(id));
}

export async function createMaterial(material) {
  const response = await apiClient.post("/api/materials", material);
  return response.data;
}
