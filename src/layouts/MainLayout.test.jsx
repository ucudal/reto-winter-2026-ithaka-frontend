import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import { AuthContext } from "../context/AuthContext";
import { ThemeModeProvider } from "../context/ThemeContext";

describe("MainLayout Component", () => {
  it("renders layout wrapper with navigation and children", () => {
    const mockUser = {
      name: "Luca",
      email: "luca@example.com",
      role: "Coordinator",
    };
    const mockLogout = vi.fn();

    render(
      <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
        <ThemeModeProvider>
          <MemoryRouter>
            <MainLayout />
          </MemoryRouter>
        </ThemeModeProvider>
      </AuthContext.Provider>,
    );

    expect(
      screen.getByRole("button", { name: /abrir menú lateral/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Resumen")).toBeInTheDocument();
  });

  it("renders user info correctly in the layout", () => {
    const mockUser = {
      name: "Luca",
      email: "luca@example.com",
      role: "Coordinator",
    };
    const mockLogout = vi.fn();

    render(
      <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
        <ThemeModeProvider>
          <MemoryRouter>
            <MainLayout />
          </MemoryRouter>
        </ThemeModeProvider>
      </AuthContext.Provider>,
    );

    expect(screen.getByText("Resumen")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir menú de usuario/i }),
    ).toBeInTheDocument();
  });
});
