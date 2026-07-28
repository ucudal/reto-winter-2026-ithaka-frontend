import { apiClient, cachedGet } from "../client";
import { clearCache } from "../../utils/cache";

function mapGroup(raw) {
  if (!raw) return raw;

  return {
    id: raw.id,
    name: raw.name,
    cohortId: raw.cohort_id,
    idea: raw.idea,
    major: raw.major,
    status: raw.status,
    currentStage: raw.current_stage ?? null,
    businessTutor: raw.business_tutor ?? null,
    technicalTutor: raw.technical_tutor ?? null,
    students: raw.students ?? [],
    cohort: raw.cohort ?? null,
  };
}

export async function getGroups(filters = {}) {
  const response = await cachedGet("/api/groups", { params: filters });
  const data = response.data;
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return items.map(mapGroup);
}


export async function saveGroup(payload) {

  if (!Array.isArray(payload.student_ids) || payload.student_ids.length === 0) {
    throw new Error("Selecciona al menos un alumno para crear el grupo.");
  }

  const response = await apiClient.put("/api/groups", {
    id: null,
    ...payload,
  });

  clearCache();
  return mapGroup(response.data);
}

export async function deleteGroup(id) {
  const response = await apiClient.delete(`/api/groups/${id}`);
  clearCache();
  return response.data;
}

export async function getGroupById(id) {
  const response = await cachedGet(`/api/groups/${id}`);
  return mapGroup(response.data);
}

export async function updateGroupStage(id, stageId) {
  const response = await apiClient.patch(`/api/groups/${id}/stage`, {
    stage_id: stageId,
  });
  clearCache();
  return mapGroup(response.data);
}

export async function updateGroupTutors(id, payload) {
  const response = await apiClient.patch(`/api/groups/${id}/tutors`, payload);
  clearCache();
  return mapGroup(response.data);
}

function mapDeliverable(raw) {
  return {
    id: raw.id,
    groupId: raw.group_id,
    stageId: raw.stage_id,
    stageName: raw.stage_name,
    expectedDate: raw.expected_date,
    status: raw.status,
  };
}

export async function getGroupDeliverables(id) {
  const response = await cachedGet(`/api/groups/${id}/deliverables`);
  const data = response.data;
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return items.map(mapDeliverable);
}
