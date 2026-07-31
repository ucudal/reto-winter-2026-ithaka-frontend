import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import UserProfileDrawer from './UserProfileDrawer'

vi.mock('../utils/ProfileDetails', () => ({
  default: ({ user }) => (
    <div data-testid="profile-details">
      {user.name} details
    </div>
  ),
}))

// Mock API calls the drawer might trigger
vi.mock('../api/endpoints/students', () => ({
  getStudentById: vi.fn(() => Promise.resolve(null)),
}))

vi.mock('../api/endpoints/tutors', () => ({
  getTutor: vi.fn(() => Promise.resolve(null)),
  getTutors: vi.fn(() => Promise.resolve([])),
  getTutorGroups: vi.fn(() => Promise.resolve([])),
}))

vi.mock('../api/endpoints/groups', () => ({
  getGroupById: vi.fn(() => Promise.resolve(null)),
  getGroups: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
  saveGroup: vi.fn(),
  deleteGroup: vi.fn(),
}))

const renderDrawer = (props) =>
  render(
    <MemoryRouter>
      <UserProfileDrawer {...props} />
    </MemoryRouter>
  )

describe('UserProfileDrawer', () => {
  const userMock = {
    name: 'María Pérez',
    role: 'BusinessTutor',
    avatarUrl: 'avatar.png',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when user is null', () => {
    const { container } = renderDrawer({
      user: null,
      open: true,
      onClose: vi.fn(),
    })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders user profile when open', () => {
    renderDrawer({ user: userMock, open: true, onClose: vi.fn() })

    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
    expect(screen.getByText('María Pérez')).toBeInTheDocument()
  })

  it('shows translated role label', () => {
    renderDrawer({ user: userMock, open: true, onClose: vi.fn() })

    expect(screen.getByText('Tutor de Negocio')).toBeInTheDocument()
  })

  it('shows original role when role is unknown', () => {
    renderDrawer({
      user: { ...userMock, role: 'Admin' },
      open: true,
      onClose: vi.fn(),
    })

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders profile details component', () => {
    renderDrawer({ user: userMock, open: true, onClose: vi.fn() })

    expect(screen.getByTestId('profile-details')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    renderDrawer({ user: userMock, open: true, onClose })

    await user.click(
      screen.getByRole('button', { name: /cerrar/i })
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders account settings link', () => {
    renderDrawer({ user: userMock, open: true, onClose: vi.fn() })

    expect(
      screen.getByRole('link', { name: /ajustes de cuenta/i })
    ).toBeInTheDocument()
  })
})
