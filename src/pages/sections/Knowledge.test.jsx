import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Knowledge from "./Knowledge";
import * as materialsApi from "../../api/endpoints/materials";
import { ToastProvider } from "../../ToastContext";

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      <ToastProvider>{component}</ToastProvider>
    </MemoryRouter>
  );
};

vi.mock("../../api/endpoints/materials", () => ({
  getMaterials: vi.fn(() =>
    Promise.resolve({ items: [], total: 0 })
  ),
  createMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
  upsertMaterial: vi.fn(),
}));

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

beforeEach(() => {
  vi.clearAllMocks();
  // Restore default implementation after clearAllMocks
  materialsApi.getMaterials.mockResolvedValue({ items: [], total: 0 });
});


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
    materialsApi.getMaterials.mockResolvedValue({
      items: [
        {
          id: 1,
          stage_id: 2,
          title: "Guía React",
          url: "https://github.com/react",
        },
      ],
      total: 1,
    });

    renderWithRouter(<Knowledge />);

    await waitFor(() => {
      expect(materialsApi.getMaterials).toHaveBeenCalled();
    });

    expect(
      screen.getByText("Guía React")
    ).toBeInTheDocument();
  });


  it("shows empty state when there are no materials", async () => {
    materialsApi.getMaterials.mockResolvedValue({ items: [], total: 0 });

    renderWithRouter(<Knowledge />);

    await waitFor(() => {
      expect(
        screen.getByText("No hay materiales para mostrar")
      ).toBeInTheDocument();
    });
  });


  it("filters materials by search", async () => {
    materialsApi.getMaterials.mockResolvedValue({
      items: [
        {
          id: 1,
          stage_id: 1,
          title: "React Guide",
          url: "https://github.com/react",
        },
        {
          id: 2,
          stage_id: 2,
          title: "Node Tutorial",
          url: "https://nodejs.org",
        },
      ],
      total: 2,
    });

    renderWithRouter(<Knowledge />);

    // Wait for materials to load
    const reactItem = await screen.findByText("React Guide");
    expect(reactItem).toBeInTheDocument();
    expect(screen.getByText("Node Tutorial")).toBeInTheDocument();

    // Filter by search term — client-side filtering via filteredMaterials
    const searchInput = screen.getByLabelText("Buscar");
    fireEvent.change(searchInput, { target: { value: "React" } });

    // After search change, loadMaterials re-fires (searchTerm in deps), so we wait
    expect(await screen.findByText("React Guide")).toBeInTheDocument();
    expect(screen.queryByText("Node Tutorial")).not.toBeInTheDocument();
  });


  it("opens create material modal", async () => {
    renderWithRouter(<Knowledge />);

    const button = screen.getByRole(
      "button",
      { name: "+ Crear Material" }
    );

    fireEvent.click(button);

    expect(
      screen.getByTestId("create-modal")
    ).toBeInTheDocument();
  });


  it("changes from table view to gallery view", async () => {
    materialsApi.getMaterials.mockResolvedValue({
      items: [
        {
          id: 1,
          stage_id: 1,
          title: "Material de prueba",
          url: "https://example.com",
        },
      ],
      total: 1,
    });

    renderWithRouter(<Knowledge />);

    // Wait for material to appear in table view
    await waitFor(() => {
      expect(screen.getByText("Material de prueba")).toBeInTheDocument();
    });

    // Switch to gallery view via the hidden native input (MUI Select in jsdom)
    const nativeInput = document.querySelector("input[aria-hidden='true'][value='list']");
    fireEvent.change(nativeInput, { target: { value: "gallery" } });

    expect(
      screen.getByLabelText("Galería de materiales")
    ).toBeInTheDocument();
  });

});
