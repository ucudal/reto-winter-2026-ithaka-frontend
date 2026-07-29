import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import TutorDetail from "./TutorDetail";
import { getTutorCapacity } from "../../api/endpoints/tutors";

vi.mock("../../api/endpoints/tutors", () => ({
  getTutorCapacity: vi.fn(),
}));

describe("TutorDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("shows loading state initially", () => {
    getTutorCapacity.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter initialEntries={["/tutors/1"]}>
        <Routes>
          <Route
            path="/tutors/:id"
            element={<TutorDetail />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();
  });



  it("renders tutor capacity information", async () => {
    getTutorCapacity.mockResolvedValue({
      max_capacity: 40,
      assigned_hours: 10,
      available_hours: 30,
      usage_percentage: 25,
    });


    render(
      <MemoryRouter initialEntries={["/tutors/1"]}>
        <Routes>
          <Route
            path="/tutors/:id"
            element={<TutorDetail />}
          />
        </Routes>
      </MemoryRouter>
    );


    await waitFor(() => {
      expect(
        screen.getByText("Capacidad del tutor")
      ).toBeInTheDocument();
    });


    expect(
      screen.getByText("40 hs")
    ).toBeInTheDocument();


    expect(
      screen.getByText("10 hs")
    ).toBeInTheDocument();


    expect(
      screen.getByText("30 hs")
    ).toBeInTheDocument();


    // MUI separa el texto "25.0" y "%"
    expect(
      screen.getByText(/25\.0/)
    ).toBeInTheDocument();
  });



  it("shows error message when capacity request fails", async () => {
    getTutorCapacity.mockRejectedValue(
      new Error("No se pudo cargar")
    );


    render(
      <MemoryRouter initialEntries={["/tutors/1"]}>
        <Routes>
          <Route
            path="/tutors/:id"
            element={<TutorDetail />}
          />
        </Routes>
      </MemoryRouter>
    );


    await waitFor(() => {
      expect(
        screen.getByText("No se pudo cargar")
      ).toBeInTheDocument();
    });
  });



  it("calls capacity endpoint with tutor id", async () => {
    getTutorCapacity.mockResolvedValue({
      max_capacity: 50,
      assigned_hours: 20,
      available_hours: 30,
      usage_percentage: 40,
    });


    render(
      <MemoryRouter initialEntries={["/tutors/7"]}>
        <Routes>
          <Route
            path="/tutors/:id"
            element={<TutorDetail />}
          />
        </Routes>
      </MemoryRouter>
    );


    await waitFor(() => {
      expect(
        getTutorCapacity
      ).toHaveBeenCalledWith("7");
    });
  });

});
