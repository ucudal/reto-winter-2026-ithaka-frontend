import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CommentFeed from "./CommentFeed";
import {
  getDeliverableComments,
  createDeliverableComment,
} from "../api/endpoints/comments";
import { getTutors } from "../api/endpoints/tutors";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../ToastContext";

vi.mock("../api/endpoints/comments", () => ({
  getDeliverableComments: vi.fn(),
  createDeliverableComment: vi.fn(),
  deleteComment: vi.fn(),
}));

vi.mock("../api/endpoints/tutors", () => ({
  getTutors: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../ToastContext", () => ({
  useToast: vi.fn(),
}));

describe("CommentFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { name: "Ana Tutor" } });
    useToast.mockReturnValue({ showToast: vi.fn() });
  });

  it("renders the existing comments and publishes a new one", async () => {
    const user = userEvent.setup();
    const showToast = vi.fn();
    useToast.mockReturnValue({ showToast });

    getDeliverableComments
      .mockResolvedValueOnce([{ id: 1, tutor_id: 7, content: "Feedback inicial" }])
      .mockResolvedValueOnce([
        { id: 1, tutor_id: 7, content: "Feedback inicial" },
        { id: 2, tutor_id: 7, content: "Nuevo comentario" },
      ]);
    getTutors.mockResolvedValue([{ id: 7, name: "Ana Tutor" }]);
    createDeliverableComment.mockResolvedValue({});

    render(<CommentFeed deliverableId={55} />);

    expect(await screen.findByText("Feedback inicial")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Escribí un comentario..."), "Nuevo comentario");
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(createDeliverableComment).toHaveBeenCalledWith(55, {
        tutor_id: 7,
        content: "Nuevo comentario",
      });
    });

    expect(await screen.findByText("Nuevo comentario")).toBeInTheDocument();
    expect(showToast).toHaveBeenCalledWith("Comentario publicado.", "success");
  });
});
