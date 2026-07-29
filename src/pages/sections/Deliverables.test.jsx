import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Deliverables from "./Deliverables";
import { getGroupDeliverables, getGroups } from "../../api/endpoints/groups";
import { getTutorGroups } from "../../api/endpoints/tutors";
import { useAuth } from "../../context/AuthContext";
import { getHomePathForRole } from "../../routes/roleHome";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../api/endpoints/groups", () => ({
  getGroupDeliverables: vi.fn(),
  getGroups: vi.fn(),
}));

vi.mock("../../api/endpoints/tutors", () => ({
  getTutorGroups: vi.fn(),
}));

vi.mock("../../routes/roleHome", () => ({
  getHomePathForRole: vi.fn(() => "/dashboard"),
}));

describe("Deliverables", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { role: "Coordinator" } });
  });

  it("renders the deliverables list and filters items by search term", async () => {
    const user = userEvent.setup();

    getGroups.mockResolvedValue([{ id: 1, name: "Grupo 1" }]);
    getGroupDeliverables.mockResolvedValue([
      {
        id: 10,
        stageName: "Etapa 1",
        expectedDate: "2026-08-01",
        status: "Pending",
      },
    ]);

    render(
      <MemoryRouter>
        <Deliverables />
      </MemoryRouter>,
    );

    expect(await screen.findByText("ENTREGABLE #10")).toBeInTheDocument();
    expect(screen.getByText("Etapa 1")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/buscar por grupo o etapa/i), "No existe");

    expect(screen.getByText(/No se encontraron entregables/i)).toBeInTheDocument();
    expect(screen.queryByText("ENTREGABLE #10")).not.toBeInTheDocument();
  });

  it("uses the tutor scope when the user is a tutor", async () => {
    useAuth.mockReturnValue({ user: { role: "BusinessTutor", tutor: { id: 99 } } });
    getTutorGroups.mockResolvedValue([{ id: 2, name: "Grupo 2" }]);
    getGroupDeliverables.mockResolvedValue([
      {
        id: 55,
        stageName: "Etapa final",
        expectedDate: "2026-09-01",
        status: "Approved",
      },
    ]);

    render(
      <MemoryRouter>
        <Deliverables />
      </MemoryRouter>,
    );

    expect(await screen.findByText("ENTREGABLE #55")).toBeInTheDocument();
    expect(getTutorGroups).toHaveBeenCalledWith(99);
  });
});
