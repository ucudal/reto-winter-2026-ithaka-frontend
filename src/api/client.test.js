import { describe, it, expect, beforeEach } from 'vitest'
import { ApiError, getAuthToken, setAuthToken, normalizeError } from './client'

describe('ApiError', () => {
  it('sets status, message and data', () => {
    const error = new ApiError({ status: 404, message: 'No encontrado', data: { id: 1 } })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.status).toBe(404)
    expect(error.message).toBe('No encontrado')
    expect(error.data).toEqual({ id: 1 })
  })
})

describe('getAuthToken / setAuthToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when there is no token saved', () => {
    expect(getAuthToken()).toBeNull()
  })

  it('saves and reads back a token', () => {
    setAuthToken('abc123')
    expect(getAuthToken()).toBe('abc123')
  })

  it('removes the token when called with a falsy value', () => {
    setAuthToken('abc123')
    setAuthToken(null)
    expect(getAuthToken()).toBeNull()
  })
})

describe('normalizeError', () => {
  it('uses the "detail" field from FastAPI when present', () => {
    const fastApiError = {
      response: {
        status: 422,
        data: { detail: 'El campo email es invalido' },
      },
    }

    const result = normalizeError(fastApiError)

    expect(result).toBeInstanceOf(ApiError)
    expect(result.status).toBe(422)
    expect(result.message).toBe('El campo email es invalido')
  })

  it('falls back to a default message by status when there is no detail', () => {
    const error = {
      response: { status: 404, data: {} },
    }

    const result = normalizeError(error)

    expect(result.status).toBe(404)
    expect(result.message).toBe('Recurso no encontrado.')
  })

  it('falls back to a generic message for an unknown status', () => {
    const error = {
      response: { status: 418, data: {} },
    }

    const result = normalizeError(error)

    expect(result.message).toBe('Error inesperado (418).')
  })

  it('handles a request that got no response (network/server down)', () => {
    const error = { request: {} }

    const result = normalizeError(error)

    expect(result.status).toBe(0)
    expect(result.message).toBe('No se pudo conectar con el servidor. Revisa tu conexion.')
  })

  it('handles unexpected errors that are neither response nor request', () => {
    const error = { message: 'Algo salio mal' }

    const result = normalizeError(error)

    expect(result.status).toBe(0)
    expect(result.message).toBe('Algo salio mal')
  })
})
