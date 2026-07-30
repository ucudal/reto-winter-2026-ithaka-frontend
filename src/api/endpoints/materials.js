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
  try {
    const response = await apiClient.get(`/api/materials/${id}`);
    return response.data;
  } catch {
    const res = await getMaterials({ page_size: 100 });
    const materials = res?.items ?? [];
    return materials.find((material) => String(material.id) === String(id));
  }
}

export async function createMaterial(material) {
  const response = await apiClient.put("/api/materials", {
    id: material.id ?? null,
    title: material.title || material.name,
    url: material.url || material.content || material.description || "",
    stage_id: material.stage_id ? Number(material.stage_id) : null,
  });
  return response.data;
}

export async function upsertMaterial(payload) {
  const response = await apiClient.put("/api/materials", payload);
  return response.data;
}

export async function deleteMaterial(id) {
  const response = await apiClient.delete(`/api/materials/${id}`);
  return response.data;
}
