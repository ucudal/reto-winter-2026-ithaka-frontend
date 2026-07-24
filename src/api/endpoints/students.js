import { apiClient } from '../client'

const MOCK_STUDENTS = [
  {
    id: 101,
    name: "Ana Fernández",
    email: "ana.fernandez@ucu.edu.uy",
    major: "Ingeniería en Sistemas",
    group_id: 45
  },
  {
    id: 102,
    name: "Luca Rossi",
    email: "luca.rossi@ucu.edu.uy",
    major: "Licenciatura en Negocios",
    group_id: 45
  },
  {
    id: 103,
    name: "Mateo Silva",
    email: "mateo.silva@ucu.edu.uy",
    major: "Ingeniería en Sistemas",
    group_id: 46
  },
  {
    id: 104,
    name: "Sofía Rodríguez",
    email: "sofia.rodriguez@ucu.edu.uy",
    major: "Licenciatura en Comunicación",
    group_id: 46
  },
  {
    id: 105,
    name: "Santiago Gómez",
    email: "santiago.gomez@ucu.edu.uy",
    major: "Ingeniería Electrónica",
    group_id: 47
  }
];

export async function getStudents() {
  try {
    const { data } = await apiClient.get('/api/students')
    return data
  } catch (err) {
    console.warn("Failing back to mock students:", err);
    return MOCK_STUDENTS;
  }
}

export async function getStudentById(id) {
  try {
    const { data } = await apiClient.get(`/api/students/${id}`)
    return data
  } catch (err) {
    const found = MOCK_STUDENTS.find(s => s.id === Number(id));
    if (found) return found;
    throw err;
  }
}

export async function createStudent(payload) {
  try {
    const { data } = await apiClient.post('/api/students', payload)
    return data
  } catch (err) {
    const newStudent = { ...payload, id: Date.now() };
    MOCK_STUDENTS.push(newStudent);
    return newStudent;
  }
}

export async function updateStudent(id, payload) {
  try {
    const { data } = await apiClient.put(`/api/students/${id}`, payload)
    return data
  } catch (err) {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...payload };
      return MOCK_STUDENTS[idx];
    }
    throw err;
  }
}

export async function deleteStudent(id) {
  try {
    const { data } = await apiClient.delete(`/api/students/${id}`)
    return data
  } catch (err) {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      MOCK_STUDENTS.splice(idx, 1);
      return { success: true };
    }
    throw err;
  }
}
