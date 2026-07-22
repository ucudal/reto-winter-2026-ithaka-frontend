export const mockGroups = [
  {
    id: 45,
    name: "EcoRoute",
    cohortId: 1,
    major: "Systems Engineering",
    idea: "Recycling route platform for companies",
    currentStage: {
      id: 2,
      name: "Preliminary Project",
    },
    businessTutor: {
      id: 8,
      name: "María Pérez",
    },
    technicalTutor: {
      id: 15,
      name: "Juan Gómez",
    },
    status: "In progress",
    students: [
      { id: 101, name: "Ana Fernández" },
      { id: 102, name: "Luca Rossi" },
    ],
    links: [
      {
        type: "Drive",
        url: "https://drive.google.com/...",
      },
    ],
  },
  {
    id: 46,
    name: "SmartHealth",
    cohortId: 2,
    major: "Computer Engineering",
    idea: "Platform for remote patient monitoring",
    currentStage: {
      id: 3,
      name: "Development",
    },
    businessTutor: {
      id: 9,
      name: "Laura García",
    },
    technicalTutor: {
      id: 16,
      name: "Carlos López",
    },
    status: "Finished",
    students: [
      { id: 103, name: "Pedro Silva" },
      { id: 104, name: "Lucía Pérez" },
    ],
    links: [
      {
        type: "GitHub",
        url: "https://github.com/example",
      },
    ],
  },
];
