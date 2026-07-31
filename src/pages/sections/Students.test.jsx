import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import Students from './Students'
import { getStudents } from '../../api/endpoints/students'
import { ToastProvider } from '../../ToastContext'

vi.mock('../../api/endpoints/students', () => ({
  getStudents: vi.fn(),
  deleteStudent: vi.fn(),
  upsertStudent: vi.fn(),
}))

vi.mock('../../api/endpoints/groups', () => ({
  getGroups: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
}))

const renderWithProviders = (ui) =>
  render(
    <MemoryRouter>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>
  )

describe('Students', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })


  it('renders students after loading data', async () => {
    getStudents.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'Juan Perez',
          email: 'juan@test.com',
          major: 'Computer Science',
          group_id: null,
        },
      ],
      total: 1,
    })

    renderWithProviders(<Students />)

    expect(
      screen.getAllByText('Alumnos').length
    ).toBeGreaterThan(0)

    expect(
      await screen.findByText('Juan Perez')
    ).toBeInTheDocument()

    expect(
      screen.getByText('juan@test.com')
    ).toBeInTheDocument()
  })


  it('shows empty state when there are no students', async () => {
    getStudents.mockResolvedValue({ items: [], total: 0 })

    renderWithProviders(<Students />)

    expect(
      await screen.findByText('No hay alumnos para mostrar')
    ).toBeInTheDocument()
  })


  it('shows error message when API fails', async () => {
    getStudents.mockRejectedValue(
      new Error('API error')
    )

    renderWithProviders(<Students />)

    expect(
      await screen.findByText('API error')
    ).toBeInTheDocument()
  })


  it('filters students by name', async () => {
    getStudents.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'Juan Perez',
          email: 'juan@test.com',
          group_id: null,
        },
        {
          id: 2,
          name: 'Maria Lopez',
          email: 'maria@test.com',
          group_id: null,
        },
      ],
      total: 2,
    })

    renderWithProviders(<Students />)

    await screen.findByText('Juan Perez')

    const searchInput = screen.getByLabelText('Buscar')

    fireEvent.change(searchInput, {
      target: { value: 'Juan' },
    })

    await waitFor(() => {
      expect(
        screen.getByText('Juan Perez')
      ).toBeInTheDocument()
    })
  })

})
