import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";

import { getTutors, upsertTutor } from "../../api/endpoints/tutors";
import { useToast } from "../../ToastContext";
import GenericEditModal from "../../components/common/GenericEditModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TUTOR_FIELDS = [
  { name: "name", label: "Nombre", type: "text", required: true, grid: 12 },
  {
    name: "role",
    label: "Rol",
    type: "select",
    required: true,
    grid: 6,
    options: [
      { value: "Business", label: "Negocio" },
      { value: "Technical", label: "Técnico" },
    ],
  },
  {
    name: "status",
    label: "Estado",
    type: "select",
    required: true,
    grid: 6,
    options: [
      { value: "Active", label: "Activo" },
      { value: "Inactive", label: "Inactivo" },
    ],
  },
  { name: "specialty", label: "Especialidad", type: "text", grid: 12 },
  { name: "availability", label: "Disponibilidad", type: "text", grid: 12 },
  {
    name: "max_capacity",
    label: "Capacidad máxima (horas)",
    type: "number",
    required: true,
    grid: 12,
    validate: (value) =>
      Number(value) < 0 ? "Debe ser un número positivo" : "",
  },
];

export default function Tutors() {
  const { showToast } = useToast();

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState("name");
  const [view, setView] = useState("list");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editingTutor, setEditingTutor] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTutors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTutors();
      setTutors(data || []);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los tutores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleOpenEdit = (tutor) => setEditingTutor(tutor);
  const handleCloseEdit = () => setEditingTutor(null);

  const handleSaveTutor = async (data) => {
    const { id, ...values } = data;
    const payload = {
      id,
      name: values.name,
      role: values.role,
      specialty: values.specialty || null,
      availability: values.availability || null,
      status: values.status,
      max_capacity: Number(values.max_capacity),
    };

    try {
      setSaving(true);
      await upsertTutor(payload);
      showToast("Tutor actualizado correctamente.", "success");
      handleCloseEdit();
      await loadTutors();
    } catch (err) {
      showToast(err?.message || "No se pudo actualizar el tutor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const valueToSearch = tutor[filterProperty]?.toString().toLowerCase() || "";
    return valueToSearch.includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Inicio
        </Link>
        <Typography color="text.primary">Tutores</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">Tutores</Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="tutors-view-label">Vista</InputLabel>
            <Select
              labelId="tutors-view-label"
              id="tutors-view"
              value={view}
              label="Vista"
              onChange={(e) => setView(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  {view === "gallery" ? (
                    <ViewModuleIcon fontSize="small" />
                  ) : (
                    <ViewListIcon fontSize="small" />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="list">Tabla</MenuItem>
              <MenuItem value="gallery">Galería</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: 40 }}
          >
            Agregar tutor
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "stretch" }}>
          <TextField
            label="Buscar"
            placeholder="Ingrese un dato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 60,
              },
            }}
          />
          <TextField
            select
            label="Filtrar por"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            variant="filled"
            sx={{
              width: 280,
              "& .MuiFilledInput-root": {
                height: 60,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                "&.Mui-focused": {
                  bgcolor: "action.hover",
                },
                "&:before": {
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                },
                "&:after": {
                  borderBottom: (theme) =>
                    `2px solid ${theme.palette.primary.main}`,
                },
              },
              "& .MuiInputLabel-root": {
                color: "primary.main",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },
            }}
          >
            <MenuItem value="name">Nombre</MenuItem>
            <MenuItem value="role">Rol</MenuItem>
            <MenuItem value="specialty">Especialidad</MenuItem>
            <MenuItem value="status">Estado</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : view === "list" ? (
          <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Rol
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Especialidad
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Disponibilidad
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.50",
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTutors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No se encontraron tutores
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTutors.map((tutor) => (
                    <TableRow key={tutor.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "action.selected",
                              color: "text.secondary",
                              width: 32,
                              height: 32,
                              fontSize: "0.875rem",
                            }}
                          >
                            {tutor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <Typography sx={{ fontWeight: "medium" }}>
                            {tutor.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            tutor.role === "Business"
                              ? "Negocio"
                              : tutor.role === "Technical"
                              ? "Técnico"
                              : tutor.role
                          }
                          size="small"
                          color={tutor.role === "Business" ? "primary" : "info"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{tutor.specialty || "-"}</TableCell>
                      <TableCell>{tutor.availability || "-"}</TableCell>
                      <TableCell>{tutor.max_capacity ?? 0} hs</TableCell>
                      <TableCell>
                        <Chip
                          label={tutor.status === "Active" ? "Activo" : "Inactivo"}
                          size="small"
                          color={tutor.status === "Active" ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                      <Tooltip title="Ver perfil">
                        <IconButton
                          size="small"
                          color="primary"
                          component={RouterLink}
                          to={`/tutors/${tutor.id}`}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Editar ${tutor.name}`}
                          onClick={() => handleOpenEdit(tutor)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Eliminar ${tutor.name}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTutors.length}
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
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {filteredTutors.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No se encontraron tutores
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredTutors.map((tutor) => (
                <Grid item xs={12} sm={6} md={4} key={tutor.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {tutor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tutor.name}
                          </Typography>
                          <Chip
                            label={
                              tutor.role === "Business"
                                ? "Tutor de Negocio"
                                : "Tutor Técnico"
                            }
                            size="small"
                            color={
                              tutor.role === "Business"
                                ? "secondary"
                                : "primary"
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        <strong>Especialidad:</strong> {tutor.specialty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Disponibilidad:</strong> {tutor.availability}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        px: 2,
                        pb: 2,
                        pt: 0,
                      }}
                    >
                      <Chip
                        label={
                          tutor.status === "Active" ? "Activo" : "Inactivo"
                        }
                        size="small"
                        color={
                          tutor.status === "Active" ? "success" : "default"
                        }
                      />
                      <Box>
                        <Tooltip title="Ver perfil">
                        <IconButton
                          size="small"
                          color="primary"
                          component={RouterLink}
                          to={`/tutors/${tutor.id}`}
                        >
                          Ver
                        </IconButton>
                      </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label={`Editar ${tutor.name}`}
                            onClick={() => handleOpenEdit(tutor)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label={`Eliminar ${tutor.name}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>

      <GenericEditModal
        open={Boolean(editingTutor)}
        onClose={handleCloseEdit}
        title="Editar tutor"
        fields={TUTOR_FIELDS}
        record={editingTutor}
        onSubmit={handleSaveTutor}
        loading={saving}
      />
    </Box>
  );
}
