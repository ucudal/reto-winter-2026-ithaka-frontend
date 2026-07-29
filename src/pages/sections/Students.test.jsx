import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import Students from './Students'
import { getStudents } from '../../api/endpoints/students'

vi.mock('../../api/endpoints/students', () => ({
  getStudents: vi.fn(),
}))


describe('Students', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })


  it('renders students after loading data', async () => {
    getStudents.mockResolvedValue([
      {
        id: 1,
        name: 'Juan Perez',
        email: 'juan@test.com',
        major: 'Computer Science',
      },
    ])

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

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
    getStudents.mockResolvedValue([])

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

    expect(
      await screen.findByText('No hay alumnos para mostrar')
    ).toBeInTheDocument()
  })


  it('shows error message when API fails', async () => {
    getStudents.mockRejectedValue(
      new Error('API error')
    )

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

    expect(
      await screen.findByText('API error')
    ).toBeInTheDocument()
  })


  it('filters students by name', async () => {
    getStudents.mockResolvedValue([
      {
        id: 1,
        name: 'Juan Perez',
        email: 'juan@test.com',
      },
      {
        id: 2,
        name: 'Maria Lopez',
        email: 'maria@test.com',
      },
    ])

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )


    const searchInput = screen.getByLabelText('Buscar')

    fireEvent.change(searchInput, {
      target: {
        value: 'Juan',
      },
    })


    await waitFor(() => {
      expect(
        screen.getByText('Juan Perez')
      ).toBeInTheDocument()

      expect(
        screen.queryByText('Maria Lopez')
      ).not.toBeInTheDocument()
    })
  })

})
