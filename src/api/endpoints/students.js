import { apiClient, cachedGet } from '../client'
import { clearCache } from '../../utils/cache'

export async function getStudents() {
  const { data } = await cachedGet('/api/students')
  return data
}

export async function getStudentById(id) {
  const { data } = await cachedGet(`/api/students/${id}`)
  return data
}

export async function createStudent(payload) {
  const { data } = await apiClient.put('/api/students', { id: null, ...payload })
  clearCache()
  return data
}

export async function updateStudent(id, payload) {
  const { data } = await apiClient.put('/api/students', { id, ...payload })
  clearCache()
  return data
}

export async function deleteStudent(id) {
  const { data } = await apiClient.delete(`/api/students/${id}`)
  clearCache()
  return data
}
