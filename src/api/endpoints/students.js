import { apiClient } from '../client'

export async function getStudents() {
  const { data } = await apiClient.get('/students')
  return data
}

export async function getStudentById(id) {
  const { data } = await apiClient.get(`/students/${id}`)
  return data
}

export async function createStudent(payload) {
  const { data } = await apiClient.post('/students', payload)
  return data
}

export async function updateStudent(id, payload) {
  const { data } = await apiClient.put(`/students/${id}`, payload)
  return data
}

export async function deleteStudent(id) {
  const { data } = await apiClient.delete(`/students/${id}`)
  return data
}
