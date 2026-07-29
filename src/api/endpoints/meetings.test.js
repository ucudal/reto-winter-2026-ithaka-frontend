import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../client";
import {
  createMeeting,
  getGroupMeetingTotalHours,
  getMeetings,
  updateMeeting,
} from "./meetings";

vi.mock("../client", () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const meetingPayload = {
  group_id: 45,
  tutor_ids: [8, 14],
  status: "Held",
  date: "2026-04-10T15:00:00.000Z",
  participants: [
    { student_id: 101, attended: true },
    { student_id: 102, attended: false },
  ],
  summary: "Revisión semanal",
  notes: "Se revisó el avance.",
  next_steps: "Completar el prototipo.",
  hours_spent: 1.5,
  links: [{ type: "Drive", url: "https://drive.google.com/minuta" }],
};

describe("meetings endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads meetings from a direct array response", async () => {
    const meetings = [{ id: 1, ...meetingPayload }];
    apiClient.get.mockResolvedValue({ data: meetings });

    await expect(getMeetings()).resolves.toEqual(meetings);
    expect(apiClient.get).toHaveBeenCalledWith("/api/meetings");
  });

  it("supports paginated meeting responses", async () => {
    const meetings = [{ id: 1, ...meetingPayload }];
    apiClient.get.mockResolvedValue({ data: { items: meetings } });

    await expect(getMeetings()).resolves.toEqual(meetings);
  });

  it("creates a meeting through the upsert endpoint with a null id", async () => {
    const created = { id: 1, ...meetingPayload };
    apiClient.put.mockResolvedValue({ data: created });

    await expect(createMeeting(meetingPayload)).resolves.toEqual(created);
    expect(apiClient.put).toHaveBeenCalledWith("/api/meetings", {
      id: null,
      ...meetingPayload,
    });
  });

  it("updates a meeting through the same upsert endpoint", async () => {
    const updated = { id: 7, ...meetingPayload };
    apiClient.put.mockResolvedValue({ data: updated });

    await expect(updateMeeting("7", meetingPayload)).resolves.toEqual(updated);
    expect(apiClient.put).toHaveBeenCalledWith("/api/meetings", {
      id: 7,
      ...meetingPayload,
    });
  });

  it("loads the total meeting hours for a group", async () => {
    const totals = {
      group_id: 45,
      total_hours: 18,
      max_capacity: 22,
      remaining_hours: 4,
    };
    apiClient.get.mockResolvedValue({ data: totals });

    await expect(getGroupMeetingTotalHours(45)).resolves.toEqual(totals);
    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/groups/45/meetings/total-hours",
    );
  });
});
