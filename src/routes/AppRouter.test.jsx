import { describe, it, expect, vi, beforeEach } from "vitest";

const createBrowserRouterMock = vi.fn(() => ({
  routes: [],
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    Navigate: () => <div>Navigate</div>,
    createBrowserRouter: createBrowserRouterMock,
  };
});

vi.mock("../layouts/MainLayout.jsx", () => ({
  default: () => <div>MainLayout</div>,
}));

vi.mock("./ProtectedRoute.jsx", () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock("./RoleProtectedRoute.jsx", () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock("./RouteErrorBoundary.jsx", () => ({
  default: () => <div>ErrorBoundary</div>,
}));

vi.mock("../pages/Auth/Login.jsx", () => ({
  default: () => <div>Login</div>,
}));

vi.mock("../pages/sections/Dashboard.jsx", () => ({
  default: () => <div>Dashboard</div>,
}));

vi.mock("../pages/sections/StudentsWorkspace.jsx", () => ({
  default: () => <div>Workspace</div>,
}));

vi.mock("../pages/sections/Students.jsx", () => ({
  default: () => <div>Students</div>,
}));

vi.mock("../pages/sections/Cohorts.jsx", () => ({
  default: () => <div>Cohorts</div>,
}));

vi.mock("../pages/sections/CohortDetail.jsx", () => ({
  default: () => <div>CohortDetail</div>,
}));

vi.mock("../pages/sections/CohortLifecycleConfiguration.jsx", () => ({
  default: () => <div>Lifecycle</div>,
}));

vi.mock("../pages/sections/Groups.jsx", () => ({
  default: () => <div>Groups</div>,
}));

vi.mock("../pages/sections/GroupDetail.jsx", () => ({
  default: () => <div>GroupDetail</div>,
}));

vi.mock("../pages/sections/Templates.jsx", () => ({
  default: () => <div>Templates</div>,
}));

vi.mock("../pages/sections/TemplateDetail.jsx", () => ({
  default: () => <div>TemplateDetail</div>,
}));

vi.mock("../pages/sections/Tutors.jsx", () => ({
  default: () => <div>Tutors</div>,
}));

vi.mock("../pages/sections/TutorDetail.jsx", () => ({
  default: () => <div>TutorDetail</div>,
}));

vi.mock("../pages/sections/Deliverables.jsx", () => ({
  default: () => <div>Deliverables</div>,
}));

vi.mock("../pages/sections/Knowledge.jsx", () => ({
  default: () => <div>Knowledge</div>,
}));

vi.mock("../pages/sections/Users.jsx", () => ({
  default: () => <div>Users</div>,
}));

vi.mock("../pages/sections/Settings.jsx", () => ({
  default: () => <div>Settings</div>,
}));

vi.mock("../pages/sections/Meetings.jsx", () => ({
  default: () => <div>Meetings</div>,
}));

vi.mock("../pages/sections/ForbiddenPage.jsx", () => ({
  default: () => <div>Forbidden</div>,
}));

vi.mock("../pages/sections/NotFoundPage.jsx", () => ({
  default: () => <div>NotFound</div>,
}));

describe("AppRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("creates the browser router", async () => {
    const router = await import("./AppRouter");

    expect(router.default).toBeDefined();
    expect(createBrowserRouterMock).toHaveBeenCalledTimes(1);
  });

  it("passes an array of routes to createBrowserRouter", async () => {
    await import("./AppRouter");

    expect(createBrowserRouterMock).toHaveBeenCalled();

    const routes = createBrowserRouterMock.mock.calls[0][0];

    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it("creates a single root route", async () => {
    await import("./AppRouter");

    const routes = createBrowserRouterMock.mock.calls[0][0];

    expect(routes).toHaveLength(1);
  });

  it("configures the root route with children", async () => {
    await import("./AppRouter");

    const routes = createBrowserRouterMock.mock.calls[0][0];

    expect(routes[0]).toHaveProperty("children");
    expect(Array.isArray(routes[0].children)).toBe(true);
  });
});
