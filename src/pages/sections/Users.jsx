import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ConfirmModal from "../../components/ConfirmModal";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/endpoints/users";

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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog & Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editUserObj, setEditUserObj] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
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

  const handleOpenCreateDialog = () => {
    setEditUserObj(null);
    setName("");
    setEmail("");
    setRole("Student");
    setPassword("");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (user) => {
    setEditUserObj(user);
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "Student");
    setPassword("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditUserObj(null);
    setName("");
    setEmail("");
    setRole("Student");
    setPassword("");
  };

  const handleCreateOrUpdateUser = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editUserObj) {
        // Edit mode
        await updateUser(editUserObj.id, { name, email, role });
      } else {
        // Create mode
        await createUser({ name, email, role, password });
      }
      handleCloseDialog();
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error inesperado al procesar usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      setError("");
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Error inesperado al eliminar el usuario");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
        >
          Inicio
        </Link>
        <Typography color="text.primary">Usuarios</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Usuarios</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Crear Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              No hay usuarios para mostrar
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Cuando el backend devuelva registros, aparecerán aquí.
            </Typography>
          </Box>
        ) : (
          <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                  const roleStyle = ROLE_STYLES[user.role] ?? ROLE_STYLES.Student;

                  return (
                    <TableRow
                      key={user.id ?? `${user.email ?? "user"}-${index}`}
                      hover
                    >
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {user.name || "Sin nombre"}
                      </TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatRole(user.role)}
                          color={roleStyle.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {user.id ?? "-"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setUserToDelete(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
          </>
        )}
      </Paper>

      {/* Create / Edit User Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateOrUpdateUser}>
          <DialogTitle>
            {editUserObj ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
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
                required
              >
                {ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Password field only during creation */}
              {!editUserObj && (
                <TextField
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  fullWidth
                  helperText="Mínimo 8 caracteres"
                  inputProps={{ minLength: 8 }}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(userToDelete)}
        title="Eliminar Usuario"
        message={`¿Estás seguro que deseas eliminar el usuario "${userToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDeleteUserConfirm}
        onClose={() => setUserToDelete(null)}
      />
    </Box>
  );
}
