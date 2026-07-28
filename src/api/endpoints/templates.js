import { apiClient } from '../client'

export async function getTemplates(deliverableId) {
  const { data } = await apiClient.get(
    `/api/deliverables/${deliverableId}/documents`
  );
  return data;
}
