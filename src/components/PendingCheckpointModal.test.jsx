import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PendingCheckpointModal from "./PendingCheckpointModal";

describe("PendingCheckpointModal", () => {
  const mockCheckpoint = {
    id: 1,
    title: "Checkpoint Trimestral - EcoRoute",
    due_date: "2026-08-15",
    status: "Pending",
    questions: [
      { id: 1, text: "¿Participaste en todas las reuniones acordadas?", answer: null },
      { id: 2, text: "¿Presentas algún bloqueo en el proyecto?", answer: null },
      { id: 3, text: "Valoración del progreso del equipo (1-5)", answer: null },
    ],
  };

  it("renders checkpoint title and questions correctly", () => {
    render(
      <PendingCheckpointModal
        open={true}
        checkpoint={mockCheckpoint}
        onClose={vi.fn()}
        onSubmitSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("Checkpoint Trimestral - EcoRoute")).toBeInTheDocument();
    expect(screen.getByText("¿Participaste en todas las reuniones acordadas?")).toBeInTheDocument();
    expect(screen.getByText("¿Presentas algún bloqueo en el proyecto?")).toBeInTheDocument();
  });

  it("submits responses when clicking submit button", async () => {
    const handleSubmitSuccess = vi.fn().mockResolvedValue(true);
    const handleClose = vi.fn();

    render(
      <PendingCheckpointModal
        open={true}
        checkpoint={mockCheckpoint}
        onClose={handleClose}
        onSubmitSuccess={handleSubmitSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /enviar evaluación/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmitSuccess).toHaveBeenCalledWith(1, expect.objectContaining({
        status: "Completed",
        questions: expect.any(Array),
      }));
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
