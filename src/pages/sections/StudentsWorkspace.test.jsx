import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";

import StudentWorkspace from "./StudentsWorkspace";

import { useAuth } from "../../context/AuthContext";
import {
  getGroupById,
  getGroupDeliverables,
} from "../../api/endpoints/groups";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../api/endpoints/groups", () => ({
  getGroupById: vi.fn(),
  getGroupDeliverables: vi.fn(),
}));

vi.mock("../../data/mockWorkspace", () => ({
  mockMinutes: [],
}));

describe("StudentWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading state initially", () => {
    useAuth.mockReturnValue({
      user: {
        student: {
          group_id: 1,
        },
      },
    });

    getGroupById.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter>
        <StudentWorkspace />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("shows empty state when student has no group", async () => {
    useAuth.mockReturnValue({
      user: {
        name: "Juan",
        email: "juan@test.com",
        student: {},
      },
    });

    render(
      <MemoryRouter>
        <StudentWorkspace />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Todavía no estás en ningún grupo")
      ).toBeInTheDocument();
    });
  });

  test("renders workspace information when group exists", async () => {
    useAuth.mockReturnValue({
      user: {
        name: "Juan",
        email: "juan@test.com",
        student: {
          group_id: 1,
        },
      },
    });

    getGroupById.mockResolvedValue({
      id: 1,
      name: "Grupo Alpha",
      idea: "Proyecto de prueba",
      students: [
        {
          id: 1,
          name: "Juan",
          email: "juan@test.com",
        },
        {
          id: 2,
          name: "Maria",
          email: "maria@test.com",
        },
      ],
      technicalTutor: {
        name: "Tutor Técnico",
      },
      businessTutor: {
        name: "Tutor Negocio",
      },
      links: [],
      currentStage: {
        name: "Inicio",
      },
    });

    getGroupDeliverables.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <StudentWorkspace />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Grupo Alpha")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Proyecto de prueba")
    ).toBeInTheDocument();
  });

  test("shows empty deliverables message when there are no deliveries", async () => {
    useAuth.mockReturnValue({
      user: {
        name: "Juan",
        email: "juan@test.com",
        student: {
          group_id: 1,
        },
      },
    });

    getGroupById.mockResolvedValue({
      id: 1,
      name: "Grupo Alpha",
      idea: "Proyecto",
      students: [],
      technicalTutor: null,
      businessTutor: null,
      links: [],
      currentStage: null,
    });

    getGroupDeliverables.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <StudentWorkspace />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "No hay entregas cargadas para tu grupo todavía."
        )
      ).toBeInTheDocument();
    });
  });
});
