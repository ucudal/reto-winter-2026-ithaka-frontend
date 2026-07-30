import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import Students from './Students'
import { getStudents } from '../../api/endpoints/students'
import { getGroups } from '../../api/endpoints/groups'

vi.mock('../../api/endpoints/students', () => ({
  getStudents: vi.fn(),
}))

vi.mock('../../api/endpoints/groups', () => ({
  getGroups: vi.fn(() => Promise.resolve([])),
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
    const students = [
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
    ]

    getStudents.mockImplementation(({ search } = {}) =>
      Promise.resolve(
        search
          ? students.filter((student) =>
              student.name.toLowerCase().includes(search.toLowerCase())
            )
          : students
      )
    )

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
      expect(getStudents).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: 'Juan',
          page_size: 100,
        })
      )
      expect(
        screen.getByText('Juan Perez')
      ).toBeInTheDocument()

      expect(
        screen.queryByText('Maria Lopez')
      ).not.toBeInTheDocument()
    })
  })

  it('sends the selected group to the backend', async () => {
    getStudents.mockResolvedValue([])
    getGroups.mockResolvedValue([{ id: 4, name: 'Grupo 4' }])

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    )

    const groupSelect = await screen.findByRole('combobox', {
      name: 'Grupo',
    })
    fireEvent.mouseDown(groupSelect)
    fireEvent.click(await screen.findByRole('option', { name: 'Grupo 4' }))

    await waitFor(() => {
      expect(getStudents).toHaveBeenLastCalledWith(
        expect.objectContaining({
          group_id: 4,
          page_size: 100,
        })
      )
    })
  })

})
