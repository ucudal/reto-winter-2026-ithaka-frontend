import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "../client";
import { clearCache } from "../../utils/cache";
import { createGroup } from "./groups";

vi.mock("../client", () => ({
  apiClient: {
    put: vi.fn(),
  },
  cachedGet: vi.fn(),
}));

vi.mock("../../utils/cache", () => ({
  clearCache: vi.fn(),
}));

describe("createGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a group through PUT with a null id", async () => {
    apiClient.put.mockResolvedValue({
      data: {
        id: 45,
        name: "EcoRoute",
        cohort_id: 1,
        students: [{ id: 101, name: "Ana Fernández" }],
      },
    });

    const result = await createGroup({
      name: "EcoRoute",
      cohort_id: 1,
      idea: null,
      student_ids: [101],
    });

    expect(apiClient.put).toHaveBeenCalledWith("/api/groups", {
      id: null,
      name: "EcoRoute",
      cohort_id: 1,
      idea: null,
      student_ids: [101],
    });
    expect(clearCache).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      id: 45,
      name: "EcoRoute",
      cohortId: 1,
    });
  });

  it("rejects an empty student list before making the request", async () => {
    await expect(
      createGroup({
        name: "EcoRoute",
        cohort_id: 1,
        student_ids: [],
      }),
    ).rejects.toThrow("Selecciona al menos un alumno");

    expect(apiClient.put).not.toHaveBeenCalled();
    expect(clearCache).not.toHaveBeenCalled();
  });
});
