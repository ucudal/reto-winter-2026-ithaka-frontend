import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmModal from './ConfirmModal'

describe('ConfirmModal', () => {
  it('does not render its content when open is false', () => {
    render(
      <ConfirmModal
        open={false}
        title="Eliminar grupo"
        message="Esta accion no se puede deshacer"
      />,
    )

    expect(screen.queryByText('Eliminar grupo')).not.toBeInTheDocument()
  })

  it('renders title and message when open', () => {
    render(
      <ConfirmModal
        open={true}
        title="Eliminar grupo"
        message="Esta accion no se puede deshacer"
      />,
    )

    expect(screen.getByText('Eliminar grupo')).toBeInTheDocument()
    expect(screen.getByText('Esta accion no se puede deshacer')).toBeInTheDocument()
  })

  it('uses default button labels when none are provided', () => {
    render(<ConfirmModal open={true} title="Titulo" message="Mensaje" />)

    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('uses custom button labels when provided', () => {
    render(
      <ConfirmModal
        open={true}
        title="Titulo"
        message="Mensaje"
        confirmText="Eliminar"
        cancelText="Volver"
      />,
    )

    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument()
  })

  it('calls onConfirm and onClose when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    render(
      <ConfirmModal
        open={true}
        title="Titulo"
        message="Mensaje"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls only onClose when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    render(
      <ConfirmModal
        open={true}
        title="Titulo"
        message="Mensaje"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
