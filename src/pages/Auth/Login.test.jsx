import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../api/endpoints/auth';

vi.mock('../../api/endpoints/auth', () => ({
  loginUser: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockedLoginUser = vi.mocked(loginUser);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it('renders login form elements correctly', () => {
    renderLogin();

    expect(screen.getByLabelText(/correo|email|usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña|password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue|iniciar sesión|login|ingresar|entrar/i })).toBeInTheDocument();
  });

  it('calls login function on valid form submission', async () => {
    mockedLoginUser.mockResolvedValue({ token: 'fake-token', user: { id: 1 } });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo|email|usuario/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña|password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /continue|iniciar sesión|login|ingresar|entrar/i }));

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: 1 });
    });
  });

  it('displays error message on failed login', async () => {
    mockedLoginUser.mockRejectedValue(new Error('Invalid credentials'));

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo|email|usuario/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña|password/i), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByRole('button', { name: /continue|iniciar sesión|login|ingresar|entrar/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
