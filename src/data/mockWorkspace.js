// Reuniones/minutas todavía no tienen endpoint en el backend (no existe meetings_api.py),
// así que esto sigue siendo mock hasta que ese módulo exista.
export const mockMinutes = [
  {
    id: 601,
    groupId: 45,
    date: "2026-07-18",
    title: "Reunión de seguimiento semanal",
    summary:
      "Se revisó el avance del MVP y se ajustó el cronograma de la próxima entrega.",
    url: "https://drive.google.com/minuta-2026-07-18",
  },
  {
    id: 602,
    groupId: 45,
    date: "2026-07-11",
    title: "Definición de alcance con tutor técnico",
    summary:
      "Se acordó el stack tecnológico y se repartieron tareas para el sprint.",
    url: "https://drive.google.com/minuta-2026-07-11",
  },
  {
    id: 603,
    groupId: 46,
    date: "2026-07-20",
    title: "Revisión de avance con tutora de negocio",
    summary:
      "Feedback sobre el pitch y próximos pasos para la ión con usuarios.",
    url: "https://drive.google.com/minuta-2026-07-20",
  },
];