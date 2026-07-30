import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Settings from "./Settings";
import { AuthProvider } from "../../context/AuthContext";
import { ToastProvider } from "../../ToastContext";

// Mock auth/API calls so AuthProvider doesn't hit the network
vi.mock("../../api/client", () => ({
  getAuthToken: vi.fn(() => null),
  setAuthToken: vi.fn(),
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../api/endpoints/auth", () => ({
  getCurrentUser: vi.fn(() => Promise.resolve({ name: "Luca", email: "luca@example.com" })),
}));

vi.mock("../../utils/cache", () => ({
  clearCache: vi.fn(),
}));

const renderWithProviders = (ui) =>
  render(
    <AuthProvider>
      <ToastProvider>{ui}</ToastProvider>
    </AuthProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Settings", () => {
  it("renders the personal information tab by default", async () => {
    renderWithProviders(<Settings />);

    expect(
      await screen.findByRole("heading", {
        name: "Configuración de la Cuenta",
      })
    ).toBeInTheDocument();
  });

  it("changes to the security tab", async () => {
    renderWithProviders(<Settings />);

    fireEvent.click(
      await screen.findByRole("tab", { name: "Seguridad" })
    );

    expect(
      screen.getByText("Cambiar Contraseña")
    ).toBeInTheDocument();
  });

  it("changes to the visual preferences tab", async () => {
    renderWithProviders(<Settings />);

    fireEvent.click(
      await screen.findByRole("tab", { name: "Preferencias Visuales" })
    );

    expect(
      screen.getByLabelText("Activar Modo Oscuro / Tema del Sistema")
    ).toBeInTheDocument();
  });

  it("shows success message after saving changes", async () => {
    renderWithProviders(<Settings />);

    fireEvent.click(
      await screen.findByRole("button", { name: "Guardar Cambios" })
    );

    expect(
      screen.getByText("¡Cambios guardados exitosamente!")
    ).toBeInTheDocument();
  });
});
