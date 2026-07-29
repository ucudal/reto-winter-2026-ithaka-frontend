import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import Tutors from "./Tutors";

import { getTutors, getTutorCapacity, getTutorGroups } from "../../api/endpoints/tutors";
import { useToast } from "../../ToastContext";

vi.mock("../../api/endpoints/tutors", () => ({
  getTutors: vi.fn(),
  upsertTutor: vi.fn(),
  getTutorCapacity: vi.fn(),
  getTutorGroups: vi.fn(),
}));

vi.mock("../../ToastContext", () => ({
  useToast: vi.fn(),
}));

vi.mock("../../components/common/GenericEditModal", () => ({
  default: () => <div data-testid="generic-modal" />,
}));

describe("Tutors", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useToast.mockReturnValue({
      showToast: vi.fn(),
    });
  });

  it("shows loading state initially", async () => {
    getTutors.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <Tutors />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });


  it("shows error when tutors fail to load", async () => {
    getTutors.mockRejectedValue(
      new Error("Failed loading tutors")
    );

    render(
      <MemoryRouter>
        <Tutors />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Failed loading tutors")
      ).toBeInTheDocument();
    });
  });


  it("renders tutors list correctly", async () => {
    getTutors.mockResolvedValue([
      {
        id: 1,
        name: "Juan Perez",
        role: "Technical",
        specialty: "Backend",
        availability: "20 hs",
        status: "Active",
        max_capacity: 40,
        linkedin_url: null,
      },
      {
        id: 2,
        name: "Ana Gomez",
        role: "Business",
        specialty: "Marketing",
        availability: "10 hs",
        status: "Inactive",
        max_capacity: 30,
        linkedin_url: null,
      },
    ]);

    render(
      <MemoryRouter>
        <Tutors />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Juan Perez")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Ana Gomez")
      ).toBeInTheDocument();
    });
  });


  it("filters tutors by name", async () => {
    getTutors.mockResolvedValue([
      {
        id: 1,
        name: "Juan Perez",
        role: "Technical",
        specialty: "Backend",
        availability: "20 hs",
        status: "Active",
        max_capacity: 40,
      },
      {
        id: 2,
        name: "Maria Lopez",
        role: "Business",
        specialty: "Ventas",
        availability: "15 hs",
        status: "Active",
        max_capacity: 30,
      },
    ]);

    render(
      <MemoryRouter>
        <Tutors />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("Juan Perez")).toBeInTheDocument()
    );

    const searchInput = screen.getByLabelText("Buscar");

    fireEvent.change(searchInput, {
      target: {
        value: "Maria",
      },
    });

    expect(screen.getByText("Maria Lopez")).toBeInTheDocument();

    expect(
      screen.queryByText("Juan Perez")
    ).not.toBeInTheDocument();
  });


  it("opens capacity dialog when clicking capacity button", async () => {
    getTutors.mockResolvedValue([
      {
        id: 1,
        name: "Carlos Ruiz",
        role: "Technical",
        specialty: "Frontend",
        availability: "20 hs",
        status: "Active",
        max_capacity: 40,
      },
    ]);

    getTutorCapacity.mockResolvedValue({
      usage_percentage: 50,
      assigned_hours: 20,
      max_capacity: 40,
      available_hours: 20,
      overloaded: false,
    });

    getTutorGroups.mockResolvedValue([
      {
        id: 1,
        name: "Grupo A",
        status: "Active",
      },
    ]);

    render(
      <MemoryRouter>
        <Tutors />
      </MemoryRouter>
    );


    await waitFor(() =>
      expect(
        screen.getByText("Carlos Ruiz")
      ).toBeInTheDocument()
    );


    const capacityButton =
      screen.getByLabelText("Ver capacidad de Carlos Ruiz");


    fireEvent.click(capacityButton);


    await waitFor(() => {
      expect(
        screen.getByText("Uso de capacidad")
      ).toBeInTheDocument();

      expect(
        screen.getByText("50%")
      ).toBeInTheDocument();
    });
  });
});
