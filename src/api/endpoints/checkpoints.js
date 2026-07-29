import { apiClient } from "../client";

/**
 * Obtiene los checkpoints pendientes de responder para el usuario/grupo actual.
 */
export async function getPendingCheckpoints() {
  try {
    const response = await apiClient.get("/api/checkpoints/my-pending");
    return response.data;
  } catch (error) {
    // Si la API aun responde 404/500 mockea lista vacia limpia
    console.warn("Could not fetch pending checkpoints:", error?.message);
    return [];
  }
}

/**
 * Envia las respuestas de un checkpoint especifico.
 * @param {number|string} id 
 * @param {Object} payload 
 */
export async function submitCheckpointResponse(id, payload) {
  const body = payload.questions
    ? payload
    : { status: "Completed", questions: payload };

  const response = await apiClient.put(`/api/checkpoints/${id}`, body);
  return response.data;
}
