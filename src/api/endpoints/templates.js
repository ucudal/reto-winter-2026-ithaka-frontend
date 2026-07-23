import { apiClient } from '../client'

export async function getTemplates(deliverableId) {
  const { data } = await apiClient.get(
    `/deliverables/${deliverableId}/documents`
  );
  return data;
}
