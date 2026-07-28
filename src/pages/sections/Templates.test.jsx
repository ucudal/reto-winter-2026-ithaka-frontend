import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
} from "vitest";

import { MemoryRouter } from "react-router-dom";

import Templates from "./Templates";


const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};


beforeEach(() => {
  vi.clearAllMocks();
});


// Mock API
vi.mock("../../api/endpoints/materials", () => ({
  getMaterials: vi.fn(),
}));


// Mock GenericCreateModal
vi.mock(
  "../../components/common/GenericCreateModal",
  () => ({
    default: ({ open, onSubmit }) =>
      open ? (
        <div data-testid="create-modal">
          <button
            onClick={() =>
              onSubmit({
                name: "Nuevo template",
                description: "Descripción nueva",
                content: "Contenido",
              })
            }
          >
            Guardar
          </button>
        </div>
      ) : null,
  })
);


// Mock EmptyState
vi.mock(
  "../../components/common/EmptyState",
  () => ({
    default: ({ title }) => (
      <div>{title}</div>
    ),
  })
);


// Mock ErrorState
vi.mock(
  "../../components/common/ErrorState",
  () => ({
    default: ({ title, message }) => (
      <div>
        {title}
        {message}
      </div>
    ),
  })
);


describe("Templates", () => {


  it("renders page title", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );

    getMaterials.mockResolvedValue([]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText("Templates")
      ).toBeInTheDocument();
    });

  });



  it("loads templates from API", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([
      {
        id: 1,
        title: "Plantilla entrega final",
        url: "https://drive.google.com/file",
        type: "Documento",
      },
    ]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "Plantilla entrega final"
        )
      ).toBeInTheDocument();
    });


    expect(getMaterials)
      .toHaveBeenCalled();

  });



  it("shows empty state when there are no templates", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "No hay templates"
        )
      ).toBeInTheDocument();
    });

  });



  it("filters templates by name", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([
      {
        id: 1,
        title: "Template React",
        url: "https://github.com/react",
        type: "Documento",
      },
      {
        id: 2,
        title: "Template Backend",
        url: "https://drive.google.com",
        type: "Documento",
      },
    ]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "Template React"
        )
      ).toBeInTheDocument();
    });


    const input = screen.getByLabelText(
      "Buscar"
    );


    fireEvent.change(input, {
      target: {
        value: "React",
      },
    });


    expect(
      screen.getByText(
        "Template React"
      )
    ).toBeInTheDocument();


    expect(
      screen.queryByText(
        "Template Backend"
      )
    ).not.toBeInTheDocument();

  });



  it("changes to gallery view", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([
      {
        id: 1,
        title: "Template React",
        url: "https://github.com/react",
        type: "Documento",
      },
    ]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "Template React"
        )
      ).toBeInTheDocument();
    });


    const select = screen.getByRole(
      "combobox",
      {
        name: "Vista",
      }
    );


    fireEvent.mouseDown(select);


    const gallery = await screen.findByText(
      "Galería"
    );


    fireEvent.click(gallery);


    expect(
      screen.getByText(
        "Template React"
      )
    ).toBeInTheDocument();

  });



  it("opens create template modal", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([]);


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "Nuevo Template"
        )
      ).toBeInTheDocument();
    });


    const button = screen.getByRole(
      "button",
      {
        name: /Nuevo Template/i,
      }
    );


    fireEvent.click(button);


    expect(
      screen.getByTestId(
        "create-modal"
      )
    ).toBeInTheDocument();

  });



  it("creates a new template", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockResolvedValue([]);


    renderWithRouter(<Templates />);


    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name: /Nuevo Template/i,
        }
      )
    );


    fireEvent.click(
      screen.getByText(
        "Guardar"
      )
    );


    await waitFor(() => {
      expect(
        screen.getByText(
          "Nuevo template"
        )
      ).toBeInTheDocument();
    });

  });



  it("shows error state when API fails", async () => {

    const { getMaterials } = await import(
      "../../api/endpoints/materials"
    );


    getMaterials.mockRejectedValue(
      new Error(
        "Error de servidor"
      )
    );


    renderWithRouter(<Templates />);


    await waitFor(() => {
      expect(
        screen.getByText(
          "Error cargando templates"
        )
      ).toBeInTheDocument();
    });

  });


});
