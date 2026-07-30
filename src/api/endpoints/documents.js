import { apiClient } from "../client";

function mapDocument(raw) {
  if (!raw) return raw;

  return {
    id: raw.id,
    entityType: raw.entity_type,
    entityId: raw.entity_id,
    url: raw.url,
    platform: raw.platform,
    order: raw.order,
  };
}

// Sin cachedGet a propósito: es una lista que el usuario edita en la misma
// pantalla, y clearCache() invalidaría todo el caché de la app por un link.

export async function getGroupDocuments(groupId) {
  const { data } = await apiClient.get(`/api/groups/${groupId}/documents`);
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return items.map(mapDocument);
}

export async function upsertGroupDocument(groupId, payload) {
  const { data } = await apiClient.put(`/api/groups/${groupId}/documents`, {
    id: null,
    ...payload,
  });
  return mapDocument(data);
}

export async function getDeliverableDocuments(deliverableId) {
  const { data } = await apiClient.get(
    `/api/deliverables/${deliverableId}/documents`,
  );
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return items.map(mapDocument);
}

export async function upsertDeliverableDocument(deliverableId, payload) {
  const { data } = await apiClient.put(
    `/api/deliverables/${deliverableId}/documents`,
    { id: null, ...payload },
  );
  return mapDocument(data);
}

export async function deleteDocument(id) {
  // El backend responde 204 sin body.
  await apiClient.delete(`/api/documents/${id}`);
  return id;
}
