import '@testing-library/jest-dom'
import { vi } from 'vitest'

function createLocalStorageMock() {
  let store = {}

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
}

vi.stubGlobal('localStorage', createLocalStorageMock())
