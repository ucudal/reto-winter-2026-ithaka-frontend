import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NotFoundPage from "./NotFoundPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../assets/img/NotFoundTroy.png", () => ({
  default: "notFound.png",
}));

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={createTheme()}>
      {component}
    </ThemeProvider>
  );
};

describe("NotFoundPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 404 page", () => {
    renderWithTheme(<NotFoundPage />);

    expect(
      screen.getByRole("heading", {
        name: "Error 404",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Página no encontrada")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "No pudimos encontrar la página que estás buscando."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Volver al inicio",
      })
    ).toBeInTheDocument();
  });

  it("renders the illustration", () => {
    renderWithTheme(<NotFoundPage />);

    expect(
      screen.getByAltText(
        "Ilustración del caballo de Troya roto en pedazos"
      )
    ).toBeInTheDocument();
  });

  it("navigates to home when clicking the button", () => {
    renderWithTheme(<NotFoundPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Volver al inicio",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
