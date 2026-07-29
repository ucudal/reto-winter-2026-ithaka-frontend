import { apiClient } from "../client";

export async function getMaterials() {
  const response = await apiClient.get("/api/materials");
  return response.data;
}

export async function getMaterialById(id) {
  const materials = await getMaterials();
  if (!Array.isArray(materials)) {
    return null;
  }
  return materials.find((material) => String(material.id) === String(id));
}

export async function createMaterial(material) {
  const response = await apiClient.post("/api/materials", material);
  return response.data;
}
