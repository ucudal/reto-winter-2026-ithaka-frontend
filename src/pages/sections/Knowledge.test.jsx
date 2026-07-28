import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Knowledge from "./Knowledge";


const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};


beforeEach(() => {
  vi.clearAllMocks();
});


// Mock API materials
vi.mock("../../api/endpoints/materials", () => ({
  getMaterials: vi.fn(() =>
    Promise.resolve([])
  ),
  createMaterial: vi.fn(),
}));


// Mock modales
vi.mock("../../components/CreateMaterialModal", () => ({
  default: () => (
    <div data-testid="create-modal">
      Create Material Modal
    </div>
  ),
}));


vi.mock("../../components/EditMaterialModal", () => ({
  default: () => (
    <div data-testid="edit-modal">
      Edit Material Modal
    </div>
  ),
}));


vi.mock("../../components/ConfirmModal", () => ({
  default: () => (
    <div data-testid="confirm-modal">
      Confirm Modal
    </div>
  ),
}));


describe("Knowledge", () => {


  it("renders page title", async () => {
    renderWithRouter(<Knowledge />);


    expect(
      screen.getByRole("heading", {
        name: "Materiales",
      })
    ).toBeInTheDocument();
  });



  it("loads materials from API", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([
      {
        id: 1,
        stage_id: 2,
        title: "Guía React",
        url: "https://github.com/react",
      },
    ]);


    renderWithRouter(<Knowledge />);


    await waitFor(() => {
      expect(getMaterials).toHaveBeenCalled();
    });


    expect(
      screen.getByText("Guía React")
    ).toBeInTheDocument();

  });



  it("shows empty state when there are no materials", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([]);


    renderWithRouter(<Knowledge />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "No hay materiales para mostrar"
        )
      ).toBeInTheDocument();
    });

  });



  it("filters materials by search", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([
      {
        id: 1,
        stage_id: 1,
        title: "React Básico",
        url: "https://github.com/react",
      },
      {
        id: 2,
        stage_id: 2,
        title: "Node avanzado",
        url: "https://nodejs.org",
      },
    ]);


    renderWithRouter(<Knowledge />);


    await waitFor(() => {
      expect(
        screen.getByText("React Básico")
      ).toBeInTheDocument();
    });


    const searchInput = screen.getByLabelText("Buscar");


    fireEvent.change(searchInput, {
      target: {
        value: "React",
      },
    });


    expect(
      screen.getByText("React Básico")
    ).toBeInTheDocument();


    expect(
      screen.queryByText("Node avanzado")
    ).not.toBeInTheDocument();

  });



  it("opens create material modal", async () => {

    renderWithRouter(<Knowledge />);


    const button = screen.getByRole(
      "button",
      {
        name: "+ Crear Material",
      }
    );


    fireEvent.click(button);


    expect(
      screen.getByTestId("create-modal")
    ).toBeInTheDocument();

  });



  it("changes from table view to gallery view", async () => {

    renderWithRouter(<Knowledge />);


    const select = screen.getByRole(
      "combobox",
      {
        name: "Vista",
      }
    );


    fireEvent.mouseDown(select);


    const galleryOption = await screen.findByText(
      "Galería"
    );


    fireEvent.click(galleryOption);


    expect(
      screen.getByLabelText(
        "Galería de materiales"
      )
    ).toBeInTheDocument();

  });


});
