import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Settings from "./Settings";

describe("Settings", () => {
  it("renders the personal information tab by default", () => {
    render(<Settings />);

    expect(
      screen.getByRole("heading", {
        name: "Configuración de la Cuenta",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Luca")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("luca@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Guardar Cambios",
      })
    ).toBeInTheDocument();
  });

  it("changes to the security tab", () => {
    render(<Settings />);

    fireEvent.click(
      screen.getByRole("tab", {
        name: "Seguridad",
      })
    );

    expect(
      screen.getByText("Cambiar Contraseña")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Contraseña Actual")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Nueva Contraseña")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Confirmar Nueva Contraseña")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Actualizar Contraseña",
      })
    ).toBeInTheDocument();
  });

  it("changes to the visual preferences tab", () => {
    render(<Settings />);

    fireEvent.click(
      screen.getByRole("tab", {
        name: "Preferencias Visuales",
      })
    );

    expect(
      screen.getByLabelText(
        "Activar Modo Oscuro / Tema del Sistema"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        "Recibir Notificaciones por Correo"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Guardar Preferencias",
      })
    ).toBeInTheDocument();
  });

  it("shows success message after saving changes", () => {
    render(<Settings />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Guardar Cambios",
      })
    );

    expect(
      screen.getByText("¡Cambios guardados exitosamente!")
    ).toBeInTheDocument();
  });
});
