import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForbiddenPage from "./ForbiddenPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      role: "Admin",
    },
  }),
}));

vi.mock("../../routes/roleHome", () => ({
  getHomePathForRole: vi.fn(() => "/dashboard"),
}));

describe("ForbiddenPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 403 page", () => {
    render(<ForbiddenPage />);

    expect(
      screen.getByRole("heading", {
        name: "403",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Acceso denegado")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "No tienes permisos para acceder a esta página."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Volver al inicio",
      })
    ).toBeInTheDocument();
  });

  it("navigates to the user's home page when clicking the button", async () => {
    const { getHomePathForRole } = await import(
      "../../routes/roleHome"
    );

    render(<ForbiddenPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Volver al inicio",
      })
    );

    expect(getHomePathForRole).toHaveBeenCalledWith(
      "Admin"
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });

  it("calls getHomePathForRole only once", async () => {
    const { getHomePathForRole } = await import(
      "../../routes/roleHome"
    );

    render(<ForbiddenPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Volver al inicio",
      })
    );

    expect(getHomePathForRole).toHaveBeenCalledTimes(1);
  });
});
