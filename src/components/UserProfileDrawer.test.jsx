import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserProfileDrawer from './UserProfileDrawer'

vi.mock('../utils/ProfileDetails', () => ({
  default: ({ user }) => (
    <div data-testid="profile-details">
      {user.name} details
    </div>
  ),
}))

describe('UserProfileDrawer', () => {
  const userMock = {
    name: 'María Pérez',
    role: 'BusinessTutor',
    avatarUrl: 'avatar.png',
  }

  it('does not render when user is null', () => {
    const { container } = render(
      <UserProfileDrawer
        user={null}
        open
        onClose={vi.fn()}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders user profile when open', () => {
    render(
      <UserProfileDrawer
        user={userMock}
        open
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByText('Mi Perfil')
    ).toBeInTheDocument()

    expect(
      screen.getByText('María Pérez')
    ).toBeInTheDocument()
  })

  it('shows translated role label', () => {
    render(
      <UserProfileDrawer
        user={userMock}
        open
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByText('Tutor de Negocio')
    ).toBeInTheDocument()
  })

  it('shows original role when role is unknown', () => {
    render(
      <UserProfileDrawer
        user={{
          ...userMock,
          role: 'Admin',
        }}
        open
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByText('Admin')
    ).toBeInTheDocument()
  })

  it('renders profile details component', () => {
    render(
      <UserProfileDrawer
        user={userMock}
        open
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByTestId('profile-details')
    ).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <UserProfileDrawer
        user={userMock}
        open
        onClose={onClose}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: 'CERRAR',
      })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders disabled edit button', () => {
    render(
      <UserProfileDrawer
        user={userMock}
        open
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByRole('button', {
        name: 'EDITAR',
      })
    ).toBeDisabled()
  })
})
