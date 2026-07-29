import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from './ErrorState'

describe('ErrorState', () => {
  it('renders default error state', () => {
    render(<ErrorState />)

    expect(
      screen.getByText('Ocurrio un error')
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'No pudimos cargar la informacion. Intenta nuevamente.'
      )
    ).toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(
      <ErrorState
        title="Error al cargar materiales"
        message="No se pudieron obtener los datos"
      />
    )

    expect(
      screen.getByText('Error al cargar materiales')
    ).toBeInTheDocument()

    expect(
      screen.getByText('No se pudieron obtener los datos')
    ).toBeInTheDocument()
  })

  it('does not render retry button without onRetry', () => {
    render(<ErrorState />)

    expect(
      screen.queryByRole('button', {
        name: 'Reintentar',
      })
    ).not.toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    render(
      <ErrorState onRetry={vi.fn()} />
    )

    expect(
      screen.getByRole('button', {
        name: 'Reintentar',
      })
    ).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ErrorState onRetry={onRetry} />
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Reintentar',
      })
    )

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
