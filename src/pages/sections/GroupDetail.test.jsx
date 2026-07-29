import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import GroupDetail from "./GroupDetail";
import { getGroupById, getGroupDeliverables } from "../../api/endpoints/groups";
import { getGroupMeetingTotalHours } from "../../api/endpoints/meetings";

vi.mock("../../api/endpoints/groups", () => ({
  getGroupById: vi.fn(),
  getGroupDeliverables: vi.fn(),
  updateGroupStage: vi.fn(),
  updateGroupTutors: vi.fn(),
}));

vi.mock("../../api/endpoints/meetings", () => ({
  getGroupMeetingTotalHours: vi.fn(),
}));

vi.mock("../../api/endpoints/deliverables", () => ({
  updateDeliverable: vi.fn(),
}));

vi.mock("../../api/endpoints/cohorts", () => ({
  getCohortStages: vi.fn(),
}));

vi.mock("../../api/endpoints/tutors", () => ({
  getTutors: vi.fn(),
}));

vi.mock("../../ToastContext", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("../../components/CommentFeed", () => ({
  default: () => null,
}));

// Necesita useAuth y pega al backend; acá solo probamos GroupDetail.
vi.mock("../../components/GroupDocumentsCard", () => ({
  default: () => null,
}));

const group = {
  id: 45,
  name: "EcoRoute",
  cohortId: 1,
  idea: "Movilidad sustentable",
  major: "Ingeniería",
  status: "Active",
  currentStage: null,
  businessTutor: null,
  technicalTutor: null,
  students: [],
  cohort: {
    id: 1,
    year: 2026,
    semester: 1,
  },
};

function renderGroupDetail() {
  return render(
    <MemoryRouter initialEntries={["/groups/45"]}>
      <Routes>
        <Route path="/groups/:id" element={<GroupDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GroupDetail meeting hours", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getGroupById.mockResolvedValue(group);
    getGroupDeliverables.mockResolvedValue([]);
  });

  it("renders the total, capacity, and remaining meeting hours", async () => {
    getGroupMeetingTotalHours.mockResolvedValue({
      group_id: 45,
      total_hours: 18,
      max_capacity: 22,
      remaining_hours: 4,
    });

    renderGroupDetail();

    expect(await screen.findByText("18 h / 22 h")).toBeInTheDocument();
    expect(screen.getByText("4 h restantes")).toBeInTheDocument();
    expect(getGroupMeetingTotalHours).toHaveBeenCalledWith(45);
  });

  it("keeps the group visible when loading meeting hours fails", async () => {
    getGroupMeetingTotalHours.mockRejectedValue(
      new Error("No se pudieron cargar las horas."),
    );

    renderGroupDetail();

    expect(
      await screen.findByText("No se pudieron cargar las horas."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("EcoRoute").length).toBeGreaterThan(0);
  });
});
