const STATUS_LABELS = {
  Active: "Activo",
  Inactive: "Inactivo",
  Planned: "Planificado",
  Finished: "Finalizado",
};

const TUTOR_ROLE_LABELS = {
  Business: "Negocio",
  Technical: "Técnico",
};

const USER_ROLE_LABELS = {
  Coordinator: "Coordinador",
  BusinessTutor: "Tutor de Negocio",
  TechnicalTutor: "Tutor Técnico",
  Student: "Estudiante",
};

export function translateStatus(status) {
  return STATUS_LABELS[status] ?? status;
}

export function translateTutorRole(role) {
  return TUTOR_ROLE_LABELS[role] ?? role;
}

export function translateUserRole(role) {
  return USER_ROLE_LABELS[role] ?? role;
}
