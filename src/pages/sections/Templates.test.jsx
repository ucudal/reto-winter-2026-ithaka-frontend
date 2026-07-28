import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Templates from "./Templates";

import { getMaterials } from "../../api/endpoints/materials";

vi.mock("../../api/endpoints/materials", () => ({
  getMaterials: vi.fn(),
}));

vi.mock("../../components/common/ErrorState", () => ({
  default: ({ title, message }) => (
    <div>
      <span>{title}</span>
      <span>{message}</span>
    </div>
  ),
}));

vi.mock("../../components/common/EmptyState", () => ({
  default: ({ title, description }) => (
    <div>
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
}));

vi.mock("../../components/common/GenericCreateModal", () => ({
  default: ({ open, onSubmit }) =>
    open ? (
      <div data-testid="create-modal">
        <button
          onClick={() =>
            onSubmit({
              name: "Nuevo template",
              description: "Descripción",
              content: "Contenido",
            })
          }
        >
          Guardar
        </button>
      </div>
    ) : null,
}));

const mockMaterials = [
  {
    id: 1,
    title: "Template React",
    url: "https://drive.google.com/file",
  },
  {
    id: 2,
    title: "Template GitHub",
    url: "https://github.com/example",
  },
];


function renderComponent() {
  return render(
    <MemoryRouter>
      <Templates />
    </MemoryRouter>
  );
}


describe("Templates", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("renders page title", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Templates",
        })
      ).toBeInTheDocument();
    });
  });


  it("loads templates from API", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Template React")
      ).toBeInTheDocument();
    });

    expect(getMaterials).toHaveBeenCalledTimes(1);
  });


  it("shows empty state when there are no templates", async () => {
    getMaterials.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("No hay templates")
      ).toBeInTheDocument();
    });
  });


  it("filters templates by name", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();


    await waitFor(() => {
      expect(
        screen.getByText("Template React")
      ).toBeInTheDocument();
    });


    const input = screen.getByLabelText("Buscar");


    fireEvent.change(input, {
      target: {
        value: "GitHub",
      },
    });


    expect(
      screen.getByText("Template GitHub")
    ).toBeInTheDocument();


    expect(
      screen.queryByText("Template React")
    ).not.toBeInTheDocument();
  });


  it("changes to gallery view", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();


    await waitFor(() => {
      expect(
        screen.getByText("Template React")
      ).toBeInTheDocument();
    });


    const selects = screen.getAllByRole("combobox");


    // Primer combobox = selector de Vista
    fireEvent.mouseDown(selects[0]);


    fireEvent.click(
      screen.getByText("Galería")
    );


    await waitFor(() => {
      expect(
        screen.getByText("Template React")
      ).toBeInTheDocument();
    });
  });


  it("opens create template modal", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();


    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Nuevo Template/i,
        })
      ).toBeInTheDocument();
    });


    fireEvent.click(
      screen.getByRole("button", {
        name: /Nuevo Template/i,
      })
    );


    expect(
      screen.getByTestId("create-modal")
    ).toBeInTheDocument();
  });


  it("creates a new template", async () => {
    getMaterials.mockResolvedValue(mockMaterials);

    renderComponent();


    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Nuevo Template/i,
        })
      ).toBeInTheDocument();
    });


    fireEvent.click(
      screen.getByRole("button", {
        name: /Nuevo Template/i,
      })
    );


    fireEvent.click(
      screen.getByText("Guardar")
    );


    await waitFor(() => {
      expect(
        screen.getByText("Nuevo template")
      ).toBeInTheDocument();
    });
  });


  it("shows error state when API fails", async () => {
    getMaterials.mockRejectedValue(
      new Error("Error de servidor")
    );


    renderComponent();


    await waitFor(() => {
      expect(
        screen.getByText("Error cargando templates")
      ).toBeInTheDocument();
    });


    expect(
      screen.getByText("Error de servidor")
    ).toBeInTheDocument();
  });

});
