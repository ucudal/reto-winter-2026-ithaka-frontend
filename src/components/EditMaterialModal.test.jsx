import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditMaterialModal from './EditMaterialModal'

describe('EditMaterialModal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const getInput = (name) =>
    document.querySelector(`input[name="${name}"]`)

  const materialMock = {
    id: 1,
    stage_id: 2,
    title: 'Material existente',
    url: 'https://example.com',
  }

  it('renders the modal when open', () => {
    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByText('Editar material')
    ).toBeInTheDocument()
  })

  it('loads material data into the form', () => {
    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(getInput('stage_id')).toHaveValue(2)
    expect(getInput('title')).toHaveValue('Material existente')
    expect(getInput('url')).toHaveValue('https://example.com')
  })

  it('allows editing fields', async () => {
    const user = userEvent.setup()

    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.clear(getInput('title'))
    await user.type(
      getInput('title'),
      'Nuevo título'
    )

    expect(
      getInput('title')
    ).toHaveValue('Nuevo título')
  })

  it('shows URL validation error when URL is invalid', async () => {
    const user = userEvent.setup()

    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.clear(getInput('url'))

    await user.type(
      getInput('url'),
      'url-invalida'
    )

    await user.click(
      screen.getByRole('button', { name: 'Guardar' })
    )

    expect(
      screen.getByText(/Ingresa una URL valida/i)
    ).toBeInTheDocument()
  })

  it('calls onSave and onClose with valid data', async () => {
    const user = userEvent.setup()

    const onSave = vi.fn()
    const onClose = vi.fn()

    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={onSave}
        onClose={onClose}
      />
    )

    await user.clear(getInput('title'))

    await user.type(
      getInput('title'),
      'Material actualizado'
    )

    await user.click(
      screen.getByRole('button', { name: 'Guardar' })
    )

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    expect(onSave).toHaveBeenCalledWith({
      stage_id: 2,
      title: 'Material actualizado',
      url: 'https://example.com',
    })
  })

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup()

    const onClose = vi.fn()

    render(
      <EditMaterialModal
        open
        material={materialMock}
        onSave={vi.fn()}
        onClose={onClose}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Cancelar' })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
