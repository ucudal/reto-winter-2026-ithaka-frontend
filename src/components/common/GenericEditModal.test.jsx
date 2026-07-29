import { render } from "@testing-library/react";
import { vi } from "vitest";
import GenericEditModal from "./GenericEditModal";

const GenericCreateModalMock = vi.hoisted(() => vi.fn());

vi.mock("./GenericCreateModal", () => ({
  default: (props) => {
    GenericCreateModalMock(props);
    return <div data-testid="generic-create-modal" />;
  },
}));

describe("GenericEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes the correct props to GenericCreateModal", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const fields = [{ name: "name", label: "Name" }];
    const record = { id: 10, name: "John" };

    render(
      <GenericEditModal
        open
        onClose={onClose}
        title="Edit User"
        fields={fields}
        record={record}
        onSubmit={onSubmit}
        loading
      />
    );

    expect(GenericCreateModalMock).toHaveBeenCalledTimes(1);

    const props = GenericCreateModalMock.mock.calls[0][0];

    expect(props.open).toBe(true);
    expect(props.onClose).toBe(onClose);
    expect(props.title).toBe("Edit User");
    expect(props.fields).toBe(fields);
    expect(props.initialValues).toEqual(record);
    expect(props.loading).toBe(true);
  });

  it("adds the record id when submitting", () => {
    const onSubmit = vi.fn();

    render(
      <GenericEditModal
        open
        onClose={vi.fn()}
        title="Edit"
        fields={[]}
        record={{ id: 25, name: "Old" }}
        onSubmit={onSubmit}
      />
    );

    const props = GenericCreateModalMock.mock.calls[0][0];

    props.onSubmit({ name: "New Name" });

    expect(onSubmit).toHaveBeenCalledWith({
      id: 25,
      name: "New Name",
    });
  });

  it("uses an empty object when record is undefined", () => {
    render(
      <GenericEditModal
        open
        onClose={vi.fn()}
        title="Edit"
        fields={[]}
        onSubmit={vi.fn()}
      />
    );

    const props = GenericCreateModalMock.mock.calls[0][0];

    expect(props.initialValues).toEqual({});
  });
});
