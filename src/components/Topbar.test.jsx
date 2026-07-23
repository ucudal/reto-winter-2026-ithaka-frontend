import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Topbar from "./Topbar";
import { ThemeModeProvider } from "../context/ThemeContext";

function renderWithTheme(ui) {
  return render(
    <ThemeModeProvider>
      {ui}
    </ThemeModeProvider>
  );
}

function TopbarWithState(props) {
  const [anchor, setAnchor] = useState(null);

  return (
    <Topbar
      {...props}
      userMenuAnchor={anchor}
      onUserMenuOpen={(event) => setAnchor(event.currentTarget)}
      onUserMenuClose={() => setAnchor(null)}
    />
  );
}

describe("Topbar", () => {
  it("renders the menu button and the user avatar button", () => {
    renderWithTheme(
      <Topbar userName="Ana" userMenuAnchor={null} />
    );

    expect(screen.getByLabelText("Abrir menú lateral")).toBeInTheDocument();
    expect(screen.getByLabelText("Abrir menú de usuario")).toBeInTheDocument();
  });

  it("calls onMenuClick when the hamburger button is clicked", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();

    renderWithTheme(
      <Topbar
        userName="Ana"
        userMenuAnchor={null}
        onMenuClick={onMenuClick}
      />
    );

    await user.click(screen.getByLabelText("Abrir menú lateral"));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it("does not show the user menu items before opening it", () => {
    renderWithTheme(
      <Topbar userName="Ana" userMenuAnchor={null} />
    );

    expect(screen.queryByText("Cerrar sesión")).not.toBeInTheDocument();
  });

  it("shows the user name and a logout option after opening the menu", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <TopbarWithState userName="Ana" />
    );

    await user.click(screen.getByLabelText("Abrir menú de usuario"));

    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
  });

  it("calls onLogout when clicking the logout option", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    renderWithTheme(
      <TopbarWithState
        userName="Ana"
        onLogout={onLogout}
      />
    );

    await user.click(screen.getByLabelText("Abrir menú de usuario"));
    await user.click(screen.getByText("Cerrar sesión"));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});