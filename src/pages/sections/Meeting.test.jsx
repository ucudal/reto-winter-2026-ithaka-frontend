import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Meetings from "./Meetings";


// Render con Router para componentes que usan react-router-dom
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


// Mock del endpoint de reuniones
vi.mock("../../api/endpoints/meetings", () => ({
  getMeetings: vi.fn(() => Promise.resolve([])),
  createMeeting: vi.fn(),
  updateMeeting: vi.fn(),
  deleteMeeting: vi.fn(),
}));


// Mock del contexto de autenticación
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      role: "Tutor",
      name: "Ana Pérez",
    },
  }),
}));


// Mock de FullCalendar
vi.mock("@fullcalendar/react", () => ({
  default: () => (
    <div data-testid="calendar">
      Calendar mock
    </div>
  ),
}));


describe("Meetings", () => {

  it("renders meetings page title", () => {
    renderWithRouter(<Meetings />);

    expect(
      screen.getByRole("heading", { name: "Reuniones" })
    ).toBeInTheDocument();
  });


  it("renders calendar component", () => {
    renderWithRouter(<Meetings />);

    expect(
      screen.getByTestId("calendar")
    ).toBeInTheDocument();
  });


  it("loads meetings from API", async () => {
    const { getMeetings } = await import(
      "../../api/endpoints/meetings"
    );


    getMeetings.mockResolvedValue([
      {
        id: 1,
        title: "Reunión inicial",
        start: "2026-07-28T10:00:00",
        end: "2026-07-28T11:00:00",
        extendedProps: {
          group: "Grupo 1",
          tutors: ["Ana Pérez"],
          participants: [
            "Sofía Martínez",
          ],
        },
      },
    ]);


    renderWithRouter(<Meetings />);


    await waitFor(() => {
      expect(getMeetings).toHaveBeenCalled();
    });
  });

});
