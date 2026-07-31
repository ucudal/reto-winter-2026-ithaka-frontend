import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import TutorDetail from "./TutorDetail";
import { getTutor, getTutorCapacity } from "../../api/endpoints/tutors";
import { ToastProvider } from "../../ToastContext";

vi.mock("../../api/endpoints/tutors", () => ({
  getTutor: vi.fn(),
  getTutorCapacity: vi.fn(),
  upsertTutor: vi.fn(),
  deleteTutor: vi.fn(),
}));

const mockTutor = {
  id: 1,
  name: "Juan Perez",
  role: "Business",
  specialty: "Finanzas",
  availability: "Lunes 10:00-14:00",
  status: "Active",
  max_capacity: 40,
  linkedin_url: null,
};

const renderWithProviders = (initialEntry = "/tutors/1") =>
  render(
    <ToastProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/tutors/:id" element={<TutorDetail />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );

describe("TutorDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTutor.mockResolvedValue(mockTutor);
  });

  it("shows loading state initially", () => {
    getTutorCapacity.mockImplementation(() => new Promise(() => {}));

    renderWithProviders();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders tutor capacity information", async () => {
    getTutorCapacity.mockResolvedValue({
      max_capacity: 40,
      assigned_hours: 10,
      available_hours: 30,
      usage_percentage: 25,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Capacidad del tutor")).toBeInTheDocument();
    });

    expect(screen.getByText("40 hs")).toBeInTheDocument();
    expect(screen.getByText("10 hs")).toBeInTheDocument();
    expect(screen.getByText("30 hs")).toBeInTheDocument();

    // MUI separa el texto "25.0" y "%"
    expect(screen.getByText(/25\.0/)).toBeInTheDocument();
  });

  it("shows error message when capacity request fails", async () => {
    getTutorCapacity.mockRejectedValue(new Error("No se pudo cargar"));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar")).toBeInTheDocument();
    });
  });

  it("calls capacity endpoint with tutor id", async () => {
    getTutorCapacity.mockResolvedValue({
      max_capacity: 50,
      assigned_hours: 20,
      available_hours: 30,
      usage_percentage: 40,
    });

    renderWithProviders("/tutors/7");

    await waitFor(() => {
      expect(getTutorCapacity).toHaveBeenCalledWith("7");
    });
  });
});
