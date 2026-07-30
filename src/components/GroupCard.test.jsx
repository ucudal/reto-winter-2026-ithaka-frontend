import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import GroupCard from "./GroupCard";

const baseGroup = {
  id: 1,
  name: "Grupo Alpha",
  status: "Active",
  students: [
    { id: 1, name: "Juan Perez" },
    { id: 2, name: "Maria Gomez" },
  ],
  businessTutor: {
    name: "Carlos Lopez",
  },
  technicalTutor: {
    name: "Ana Rodriguez",
  },
  currentStage: {
    name: "Desarrollo",
  },
};

const renderComponent = (group = baseGroup) => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  render(
    <MemoryRouter>
      <GroupCard
        group={group}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </MemoryRouter>
  );

  return { onEdit, onDelete };
};

describe("GroupCard", () => {
  it("renders group information", () => {
    renderComponent();

    expect(screen.getByText("Grupo Alpha")).toBeInTheDocument();
    expect(screen.getByText("Juan, Maria")).toBeInTheDocument();
    expect(screen.getByText("Carlos, Ana")).toBeInTheDocument();
    expect(screen.getByText("Desarrollo")).toBeInTheDocument();
  });

  it("shows missing tutors message", () => {
    renderComponent({
      ...baseGroup,
      businessTutor: null,
      technicalTutor: null,
    });

    expect(screen.getAllByText("Sin tutores asignados")).toHaveLength(2);
  });

  it("shows inactive status", () => {
    renderComponent({
      ...baseGroup,
      status: "Inactive",
    });

    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const { onEdit } = renderComponent();

    await user.click(screen.getByLabelText("Editar"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(baseGroup);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderComponent();

    await user.click(screen.getByLabelText("Eliminar"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(baseGroup);
  });

  it("links to the group detail page", () => {
    renderComponent();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/groups/1"
    );
  });
});
