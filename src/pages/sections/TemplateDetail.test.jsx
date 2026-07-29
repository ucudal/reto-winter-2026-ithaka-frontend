import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import TemplateDetail from "./TemplateDetail";

import { getMaterialById } from "../../api/endpoints/materials";

vi.mock("../../api/endpoints/materials", () => ({
  getMaterialById: vi.fn(),
}));



vi.mock("react-quill", () => {
  return {
    default: ({ value, onChange }) => (
      <textarea
        data-testid="react-quill"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  };
});


describe("TemplateDetail", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  function renderComponent(id = "1") {
    return render(
      <MemoryRouter initialEntries={[`/templates/${id}`]}>
        <Routes>
          <Route
            path="/templates/:id"
            element={<TemplateDetail />}
          />

          <Route
            path="/templates"
            element={<div>Templates page</div>}
          />
        </Routes>
      </MemoryRouter>
    );
  }


  it("shows loading state", () => {

    getMaterialById.mockReturnValue(
      new Promise(() => {})
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();

  });

  it("loads template from API and displays name", async () => {

    getMaterialById.mockResolvedValue({
      id: 1,
      name: "Template Entrega Final",
      content: "Contenido inicial",
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template Entrega Final")
      ).toBeInTheDocument();
    });


    expect(getMaterialById)
      .toHaveBeenCalledWith("1");

    expect(
      screen.getByTestId("react-quill")
    ).toHaveValue("Contenido inicial");

  });

  it("loads content from url when content does not exist", async () => {

    getMaterialById.mockResolvedValue({
      id: 1,
      name: "Template URL",
      url: "https://drive.google.com/file",
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template URL")
      ).toBeInTheDocument();
    });


    expect(
      screen.getByTestId("react-quill")
    ).toHaveValue(
      "https://drive.google.com/file"
    );

  });


  it("shows error when API fails", async () => {

    getMaterialById.mockRejectedValue(
      new Error("Error de servidor")
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Error cargando template")
      ).toBeInTheDocument();
    });


    expect(
      screen.getByText("Error de servidor")
    ).toBeInTheDocument();

  });

  it("shows error when template does not exist", async () => {

    getMaterialById.mockResolvedValue(null);
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template no encontrado")
      ).toBeInTheDocument();

    });

  });



  it("updates content in editor", async () => {
    getMaterialById.mockResolvedValue({
      id: 1,
      name: "Template prueba",
      content: "Contenido viejo",
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template prueba")
      ).toBeInTheDocument();
    });

    const editor = screen.getByTestId("react-quill");

    fireEvent.change(editor, {
      target: {
        value: "Nuevo contenido",
      },
    });

    expect(editor)
      .toHaveValue("Nuevo contenido");

  });


  it("saves changes and navigates to templates", async () => {
    getMaterialById.mockResolvedValue({
      id: 1,
      name: "Template guardar",
      content: "Contenido",
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template guardar")
      ).toBeInTheDocument();
    });


    fireEvent.click(
      screen.getByRole("button", {
        name: /Guardar cambios/i,
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Templates page")
      ).toBeInTheDocument();
    });

  });
});
