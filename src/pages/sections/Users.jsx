import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ROLE_OPTIONS = [
  { value: "Student", label: "Student" },
  { value: "TechnicalTutor", label: "Technical Tutor" },
  { value: "BusinessTutor", label: "Business Tutor" },
  { value: "Coordinator", label: "Coordinator" },
];

const ROLE_STYLES = {
  Coordinator: { label: "Coordinator", color: "warning" },
  BusinessTutor: { label: "Business Tutor", color: "info" },
  TechnicalTutor: { label: "Technical Tutor", color: "success" },
  Student: { label: "Student", color: "default" },
};

function normalizeUsersResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function formatRole(role) {
  return ROLE_STYLES[role]?.label ?? role ?? "N/A";
}

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo cargar la lista de usuarios");
      }

      const data = await response.json();
      setUsers(normalizeUsersResponse(data));
    } catch (err) {
      setError(err.message || "Error inesperado al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ name, email, role }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la cuenta");
      }

      setName('');
      setEmail('');
      setRole('Student');
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error inesperado al crear el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const coordinators = users.filter((user) => user.role === "Coordinator").length;
    const tutors = users.filter((user) => ["BusinessTutor", "TechnicalTutor"].includes(user.role)).length;

    return [
      { label: "Total registrados", value: total },
      { label: "Coordinators", value: coordinators },
      { label: "Tutores", value: tutors },
    ];
  }, [users]);

  return (
    <Box sx={{ maxWidth: 1240, mx: "auto", pb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: "common.white",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.12), transparent 32%)",
            pointerEvents: "none",
          }}
        />
        <Stack spacing={1} sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            label="Solo Coordinator"
            sx={{ alignSelf: "flex-start", bgcolor: "rgba(255,255,255,0.15)", color: "common.white" }}
          />
          <Typography variant="h4" fontWeight={800}>
            Gestión de usuarios
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 760, color: "rgba(255,255,255,0.85)" }}>
            Visualiza las cuentas registradas, asigna roles y crea nuevas cuentas
            desde una vista protegida para coordinadores.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((item) => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Stack spacing={1.5}>
              <Typography variant="h6" fontWeight={700}>
                Alta de usuario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El backend debería aceptar al menos nombre, email y rol. Si la
                respuesta llega como objeto con users, también se normaliza.
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 3 }}>
              <Stack spacing={2}>
                <TextField
                  label="Nombre completo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  select
                  label="Rol"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  fullWidth
                >
                  {ROLE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear cuenta"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Paper sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Cuentas registradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lectura desde /api/users con los campos más útiles para
                administración: nombre, email, rol e identificador.
              </Typography>
            </Box>
            <Divider />

            {loading ? (
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={56} />
                  <Skeleton variant="rounded" height={56} />
                  <Skeleton variant="rounded" height={56} />
                </Stack>
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  No hay usuarios para mostrar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Cuando el backend devuelva registros, aparecerán aquí con su nombre,
                  email y rol.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                  <Box component="thead" sx={{ bgcolor: "grey.50" }}>
                    <Box component="tr">
                      <Box component="th" sx={{ textAlign: "left", p: 2.25, fontSize: 13, color: "text.secondary" }}>
                        Usuario
                      </Box>
                      <Box component="th" sx={{ textAlign: "left", p: 2.25, fontSize: 13, color: "text.secondary" }}>
                        Email
                      </Box>
                      <Box component="th" sx={{ textAlign: "left", p: 2.25, fontSize: 13, color: "text.secondary" }}>
                        Rol
                      </Box>
                      <Box component="th" sx={{ textAlign: "left", p: 2.25, fontSize: 13, color: "text.secondary" }}>
                        ID
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {users.map((user, index) => {
                      const roleStyle = ROLE_STYLES[user.role] ?? ROLE_STYLES.Student;

                      return (
                        <Box
                          component="tr"
                          key={user.id ?? `${user.email ?? "user"}-${index}`}
                          sx={{
                            borderTop: "1px solid",
                            borderColor: "divider",
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "grey.50" },
                          }}
                        >
                          <Box component="td" sx={{ p: 2.25 }}>
                            <Stack spacing={0.3}>
                              <Typography variant="body2" fontWeight={700}>
                                {user.name || "Sin nombre"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Cuenta administrada por Coordinator
                              </Typography>
                            </Stack>
                          </Box>
                          <Box component="td" sx={{ p: 2.25 }}>
                            <Typography variant="body2">{user.email || "-"}</Typography>
                          </Box>
                          <Box component="td" sx={{ p: 2.25 }}>
                            <Chip label={formatRole(user.role)} color={roleStyle.color} size="small" variant="outlined" />
                          </Box>
                          <Box component="td" sx={{ p: 2.25 }}>
                            <Typography variant="body2" color="text.secondary">
                              {user.id ?? "-"}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;
