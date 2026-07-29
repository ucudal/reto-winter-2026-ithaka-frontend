import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CohortLifecycleConfiguration from "./CohortLifecycleConfiguration";

import * as stageApi from "../../api/endpoints/stages";


vi.mock("../../api/endpoints/stages", () => ({
  getStages: vi.fn(),
  upsertStage: vi.fn(),
}));


const mockStages = [
  {
    id: 1,
    cohort_id: 1,
    name: "Primera",
    order: 1,
    key_dates: [],
  },
  {
    id: 2,
    cohort_id: 1,
    name: "Segunda",
    order: 2,
    key_dates: [],
  },
];


function renderComponent() {
  return render(
    <MemoryRouter initialEntries={["/cohorts/1/configuration"]}>
      <Routes>
        <Route
          path="/cohorts/:id/configuration"
          element={<CohortLifecycleConfiguration />}
        />
      </Routes>
    </MemoryRouter>
  );
}


describe("CohortLifecycleConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("shows loading state", async () => {
    stageApi.getStages.mockImplementation(
      () => new Promise(() => {})
    );

    renderComponent();

    expect(
      screen.getByRole("progressbar")
    ).toBeInTheDocument();
  });


  it("loads stages for current cohort", async () => {
    stageApi.getStages.mockResolvedValue(mockStages);

    renderComponent();

    expect(
      await screen.findByText(/Primera/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Segunda/)
    ).toBeInTheDocument();
  });


  it("shows empty state when there are no stages", async () => {
    stageApi.getStages.mockResolvedValue([]);

    renderComponent();

    expect(
      await screen.findByText(
        "Este cohorte todavía no tiene etapas configuradas."
      )
    ).toBeInTheDocument();
  });


  it("shows error when loading stages fails", async () => {
    stageApi.getStages.mockRejectedValue(
      new Error("Servidor caído")
    );

    renderComponent();

    expect(
      await screen.findByText(
        "No se pudieron cargar las etapas del cohorte."
      )
    ).toBeInTheDocument();
  });


  it("adds a new stage", async () => {
    stageApi.getStages.mockResolvedValue([]);

    stageApi.upsertStage.mockResolvedValue({
      id: 3,
      cohort_id: 1,
      name: "Nueva etapa",
      order: 1,
      key_dates: [],
    });


    renderComponent();


    const input = await screen.findByLabelText("Nombre");

    fireEvent.change(input, {
      target: {
        value: "Nueva etapa",
      },
    });


    fireEvent.click(
      screen.getByText("Agregar hito")
    );


    await waitFor(() => {
      expect(
        stageApi.upsertStage
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nueva etapa",
          cohort_id: 1,
        })
      );
    });
  });


  it("moves a stage up", async () => {
    stageApi.getStages.mockResolvedValue(mockStages);

    stageApi.upsertStage.mockResolvedValue({});

    renderComponent();

    await screen.findByText(/Segunda/);

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[3]);

    await waitFor(() => {
      expect(
        stageApi.upsertStage
      ).toHaveBeenCalledTimes(2);
    });
  });

  it("deletes a stage", async () => {
    stageApi.getStages.mockResolvedValue([
      {
        id: 10,
        cohort_id: 1,
        name: "Eliminar",
        order: 1,
        key_dates: [],
      },
    ]);


    stageApi.upsertStage.mockResolvedValue({});


    renderComponent();


    await screen.findByText(/Eliminar/);


    const buttons =
      screen.getAllByRole("button");


    fireEvent.click(buttons[2]);


    await waitFor(() => {
      expect(
        stageApi.upsertStage
      ).toHaveBeenCalled();
    });
  });

});
