import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationControls from "./PaginationControls";

const noop = () => {};

describe("PaginationControls", () => {
  it("shows an open-ended total while there is a next page", () => {
    render(
      <PaginationControls
        page={0}
        rowsPerPage={10}
        hasNextPage={true}
        loadedRows={10}
        onPageChange={noop}
        onRowsPerPageChange={noop}
      />,
    );

    expect(screen.getByText("1-10 de más de 10")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeEnabled();
  });

  it("shows the exact total and disables next on the last page", () => {
    render(
      <PaginationControls
        page={2}
        rowsPerPage={10}
        hasNextPage={false}
        loadedRows={7}
        onPageChange={noop}
        onRowsPerPageChange={noop}
      />,
    );

    expect(screen.getByText("21-27 de 27")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });

  it("reports the new page number when clicking next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <PaginationControls
        page={0}
        rowsPerPage={10}
        hasNextPage={true}
        loadedRows={10}
        onPageChange={onPageChange}
        onRowsPerPageChange={noop}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("reports rows per page as a number", async () => {
    const user = userEvent.setup();
    const onRowsPerPageChange = vi.fn();

    render(
      <PaginationControls
        page={0}
        rowsPerPage={10}
        hasNextPage={true}
        loadedRows={10}
        onPageChange={noop}
        onRowsPerPageChange={onRowsPerPageChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "25" }));

    expect(onRowsPerPageChange).toHaveBeenCalledWith(25);
  });

  it("uses totalCount when the list is paginated in memory", () => {
    render(
      <PaginationControls
        page={0}
        rowsPerPage={10}
        hasNextPage={false}
        loadedRows={10}
        totalCount={12}
        onPageChange={noop}
        onRowsPerPageChange={noop}
      />,
    );

    // Con total conocido manda totalCount y no hasNextPage: todavia queda una pagina.
    expect(screen.getByText("1-10 de 12")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeEnabled();
  });

  it("handles an empty first page", () => {
    render(
      <PaginationControls
        page={0}
        rowsPerPage={10}
        hasNextPage={false}
        loadedRows={0}
        onPageChange={noop}
        onRowsPerPageChange={noop}
      />,
    );

    expect(screen.getByText("0-0 de 0")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" }),
    ).toBeDisabled();
  });
});
