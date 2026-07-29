// Home ("Inicio") de cada rol. El Dashboard es contenido de gestión (capacidad
// de tutores, grupos del sistema, etc.) y solo lo ve el Coordinator; el resto
// aterriza en su pantalla principal.
export function getHomePathForRole(role) {
  switch (role) {
    case "Coordinator":
      return "/dashboard";
    case "Student":
      return "/workspace";
    case "BusinessTutor":
    case "TechnicalTutor":
      return "/groups";
    default:
      return "/groups";
  }
}
