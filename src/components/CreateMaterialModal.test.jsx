import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateMaterialModal from './CreateMaterialModal'

describe('CreateMaterialModal', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const getInput = (name) =>
    document.querySelector(`input[name="${name}"]`)

  it('renders the modal when open', () => {
    render(
      <CreateMaterialModal
        open
        onCreate={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByText('Crear material')
    ).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <CreateMaterialModal
        open={false}
        onCreate={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expect(
      screen.queryByText('Crear material')
    ).not.toBeInTheDocument()
  })

  it('allows user to fill the form', async () => {
    const user = userEvent.setup()

    render(
      <CreateMaterialModal
        open
        onCreate={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.type(getInput('stage_id'), '1')
    await user.type(getInput('title'), 'Material React')
    await user.type(getInput('url'), 'https://example.com')

    expect(getInput('stage_id')).toHaveValue(1)
    expect(getInput('title')).toHaveValue('Material React')
    expect(getInput('url')).toHaveValue('https://example.com')
  })

  it('shows URL error when URL is invalid', async () => {
    const user = userEvent.setup()

    render(
      <CreateMaterialModal
        open
        onCreate={vi.fn()}
        onClose={vi.fn()}
      />
    )

    await user.type(getInput('stage_id'), '1')
    await user.type(getInput('title'), 'Material')
    await user.type(getInput('url'), 'invalid')

    await user.click(
      screen.getByRole('button', { name: 'Crear' })
    )

    expect(
      screen.getByText(/Ingresa una URL valida/i)
    ).toBeInTheDocument()
  })

  it('creates material with valid data', async () => {
    const user = userEvent.setup()

    const onCreate = vi.fn()
    const onClose = vi.fn()

    render(
      <CreateMaterialModal
        open
        onCreate={onCreate}
        onClose={onClose}
      />
    )

    await user.type(getInput('stage_id'), '2')
    await user.type(getInput('title'), 'Nuevo material')
    await user.type(getInput('url'), 'https://google.com')

    await user.click(
      screen.getByRole('button', { name: 'Crear' })
    )

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        stage_id: 2,
        title: 'Nuevo material',
        url: 'https://google.com',
        id: expect.any(Number),
      })
    )
  })

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup()

    const onClose = vi.fn()

    render(
      <CreateMaterialModal
        open
        onCreate={vi.fn()}
        onClose={onClose}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Cancelar' })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
