import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders default title', () => {
    render(<EmptyState />)

    expect(
      screen.getByText('No hay datos para mostrar')
    ).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(
      <EmptyState title="No hay materiales disponibles" />
    )

    expect(
      screen.getByText('No hay materiales disponibles')
    ).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="No encontramos elementos"
      />
    )

    expect(
      screen.getByText('No encontramos elementos')
    ).toBeInTheDocument()
  })

  it('renders image when provided', () => {
    render(
      <EmptyState
        image="/empty.png"
        imageAlt="Imagen vacía"
      />
    )

    const image = screen.getByAltText('Imagen vacía')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      '/empty.png'
    )
  })

  it('renders action when provided', () => {
    render(
      <EmptyState
        action={
          <button>
            Crear
          </button>
        }
      />
    )

    expect(
      screen.getByRole('button', { name: 'Crear' })
    ).toBeInTheDocument()
  })
})
