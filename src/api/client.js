import axios from 'axios'

import { env } from '../config/env'
import { getCache, setCache } from '../utils/cache'

const AUTH_TOKEN_KEY = 'ithaka_auth_token'

const STATUS_MESSAGES = {
  400: 'Solicitud invalida.',
  401: 'No autorizado. Inicia sesion nuevamente.',
  403: 'No tenes permisos para realizar esta accion.',
  404: 'Recurso no encontrado.',
  409: 'Conflicto con el estado actual del recurso.',
  422: 'Los datos enviados no son validos.',
  500: 'Error interno del servidor.',
}

export class ApiError extends Error {
  constructor({ status, message, data }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

function messageForStatus(status, data) {
  return (
    data?.detail ||
    data?.message ||
    STATUS_MESSAGES[status] ||
    `Error inesperado (${status}).`
  )
}

export function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response
    return new ApiError({ status, message: messageForStatus(status, data), data })
  }

  if (error.request) {
    return new ApiError({
      status: 0,
      message: 'No se pudo conectar con el servidor. Revisa tu conexion.',
    })
  }

  return new ApiError({ status: 0, message: error.message })
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null)
    }
    return Promise.reject(normalizeError(error))
  },
)

export async function cachedGet(url, config = {}, ttlInMinutes = 15) {
  const cacheKey = `cache_${url}`
  const cached = getCache(cacheKey)

  if (cached.hit) {
    return { data: cached.data, fromCache: true }
  }

  const response = await apiClient.get(url, config)
  setCache(cacheKey, response.data, ttlInMinutes)
  return response
}
