import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CohortDetail from "./CohortDetail";
import {
  getCohortById,
  getCohortGroups,
  getCohortStages,
} from "../../api/endpoints/cohorts";
import { getStageExpectedDeliverables } from "../../api/endpoints/stages";

vi.mock("../../api/endpoints/cohorts", () => ({
  getCohortById: vi.fn(),
  getCohortGroups: vi.fn(),
  getCohortStages: vi.fn(),
}));

vi.mock("../../api/endpoints/stages", () => ({
  getStageExpectedDeliverables: vi.fn(),
}));

function renderCohortDetail() {
  return render(
    <MemoryRouter initialEntries={["/cohorts/7"]}>
      <Routes>
        <Route path="/cohorts/:id" element={<CohortDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("CohortDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the cohort summary and the groups tab content", async () => {
    getCohortById.mockResolvedValue({
      id: 7,
      year: 2026,
      semester: 1,
      status: "Active",
      start_date: "2026-03-01",
      end_date: "2026-08-01",
      notes: "Cohorte de prueba",
    });
    getCohortGroups.mockResolvedValue([{ id: 11, name: "Grupo Alpha", status: "Active" }]);
    getCohortStages.mockResolvedValue([]);

    renderCohortDetail();

    expect(await screen.findByText("Cohorte 2026 - 1° semestre")).toBeInTheDocument();
    expect(await screen.findByText("Grupo Alpha")).toBeInTheDocument();
    expect(screen.getByText("1 grupos")).toBeInTheDocument();
  });

  it("shows expected deliverables when switching to the stages tab", async () => {
    const user = userEvent.setup();

    getCohortById.mockResolvedValue({
      id: 7,
      year: 2026,
      semester: 1,
      status: "Active",
      start_date: "2026-03-01",
      end_date: "2026-08-01",
      notes: "",
    });
    getCohortGroups.mockResolvedValue([]);
    getCohortStages.mockResolvedValue([{ id: 4, name: "Diseño", order: 1 }]);
    getStageExpectedDeliverables.mockResolvedValue([{ id: 1, groupName: "Grupo Beta" }]);

    renderCohortDetail();

    await user.click(screen.getByRole("tab", { name: /etapas del proceso/i }));

    expect(await screen.findByText("Diseño")).toBeInTheDocument();
    expect(await screen.findByText("Grupo Beta")).toBeInTheDocument();
    expect(getStageExpectedDeliverables).toHaveBeenCalledWith(4);
  });
});
