import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GenericCreateModal from "./GenericCreateModal";

vi.mock("react-quill", () => ({
  default: () => null,
}));

const INITIAL_VALUES = {
  student_ids: [],
};

describe("GenericCreateModal", () => {
  it("does not submit a required multiple select with no options selected", () => {
    const onSubmit = vi.fn();

    render(
      <GenericCreateModal
        open
        onClose={vi.fn()}
        title="Agregar grupo"
        fields={[
          {
            name: "student_ids",
            label: "Alumnos",
            type: "select",
            multiple: true,
            required: true,
            options: [{ value: 101, label: "Ana Fernández" }],
          },
        ]}
        initialValues={INITIAL_VALUES}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Alumnos es requerido")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
