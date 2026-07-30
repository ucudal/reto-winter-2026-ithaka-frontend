import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient, cachedGet } from "../client";
import { getMaterials } from "./materials";
import { getStudents } from "./students";
import { getTutors } from "./tutors";

vi.mock("../client", () => ({
  apiClient: {
    get: vi.fn(),
  },
  cachedGet: vi.fn(),
}));

describe("server-side list filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forwards material search and stage filters", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    const filters = { search: "canvas", stage_id: 2, page_size: 100 };

    await getMaterials(filters);

    expect(apiClient.get).toHaveBeenCalledWith("/api/materials", {
      params: filters,
    });
  });

  it("forwards student search and group filters", async () => {
    cachedGet.mockResolvedValue({ data: [] });
    const filters = { search: "ana", group_id: 4, page_size: 100 };

    await getStudents(filters);

    expect(cachedGet).toHaveBeenCalledWith("/api/students", {
      params: filters,
    });
  });

  it("forwards tutor search, role and status filters", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    const filters = {
      search: "martín",
      role: "Technical",
      status: "Active",
      page_size: 100,
    };

    await getTutors(filters);

    expect(apiClient.get).toHaveBeenCalledWith("/api/tutors", {
      params: filters,
    });
  });
});
