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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import {
  getTutors,
  upsertTutor,
  getTutorCapacity,
  getTutorGroups,
} from "../../api/endpoints/tutors";
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
  { name: "linkedin_url", label: "LinkedIn (URL)", type: "text", grid: 12 },
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null); // null => crear
  const [saving, setSaving] = useState(false);

  const [capacityOpen, setCapacityOpen] = useState(false);
  const [capacityLoading, setCapacityLoading] = useState(false);
  const [capacityData, setCapacityData] = useState(null);
  const [capacityGroups, setCapacityGroups] = useState([]);
  const [capacityTutor, setCapacityTutor] = useState(null);

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

  const handleOpenCreate = () => {
    setEditingTutor(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (tutor) => {
    setEditingTutor(tutor);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleSaveTutor = async (data) => {
    const { id, ...values } = data;
    const isEdit = Boolean(id);
    const payload = {
      id: id ?? null,
      name: values.name,
      role: values.role,
      specialty: values.specialty || null,
      availability: values.availability || null,
      status: values.status,
      max_capacity: Number(values.max_capacity),
      linkedin_url: values.linkedin_url ?? null,
    };

    try {
      setSaving(true);
      await upsertTutor(payload);
      showToast(
        isEdit
          ? "Tutor actualizado correctamente."
          : "Tutor creado correctamente.",
        "success",
      );
      handleCloseModal();
      await loadTutors();
    } catch (err) {
      showToast(
        err?.message ||
          (isEdit
            ? "No se pudo actualizar el tutor."
            : "No se pudo crear el tutor."),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCapacity = async (tutor) => {
    setCapacityTutor(tutor);
    setCapacityOpen(true);
    setCapacityLoading(true);
    setCapacityData(null);
    setCapacityGroups([]);
    try {
      const [capacity, groups] = await Promise.all([
        getTutorCapacity(tutor.id),
        getTutorGroups(tutor.id),
      ]);
      setCapacityData(capacity);
      setCapacityGroups(groups || []);
    } catch (err) {
      showToast(
        err?.message || "No se pudo cargar la capacidad del tutor.",
        "error",
      );
      setCapacityOpen(false);
    } finally {
      setCapacityLoading(false);
    }
  };
  const handleCloseCapacity = () => setCapacityOpen(false);

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
            onClick={handleOpenCreate}
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
                          <Typography variant="body2" fontWeight="medium">
                            {tutor.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {tutor.role === "Business" ? "Negocio" : "Técnico"}
                      </TableCell>
                      <TableCell>{tutor.specialty}</TableCell>
                      <TableCell>{tutor.availability}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            tutor.status === "Active" ? "Activo" : "Inactivo"
                          }
                          size="small"
                          color={
                            tutor.status === "Active" ? "success" : "default"
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        {tutor.linkedin_url && (
                          <Tooltip title="Ver LinkedIn">
                            <IconButton
                              size="small"
                              component="a"
                              href={tutor.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Abrir LinkedIn de ${tutor.name}`}
                            >
                              <LinkedInIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

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

                        <Tooltip title="Ver capacidad">
                          <IconButton
                            size="small"
                            aria-label={`Ver capacidad de ${tutor.name}`}
                            onClick={() => handleOpenCapacity(tutor)}
                          >
                            <AssessmentIcon fontSize="small" />
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
                        {tutor.linkedin_url && (
                          <Tooltip title="Ver LinkedIn">
                            <IconButton
                              size="small"
                              component="a"
                              href={tutor.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Abrir LinkedIn de ${tutor.name}`}
                            >
                              <LinkedInIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
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
                        <Tooltip title="Ver capacidad">
                          <IconButton
                            size="small"
                            aria-label={`Ver capacidad de ${tutor.name}`}
                            onClick={() => handleOpenCapacity(tutor)}
                          >
                            <AssessmentIcon fontSize="small" />
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
        open={modalOpen}
        onClose={handleCloseModal}
        title={editingTutor ? "Editar tutor" : "Agregar tutor"}
        fields={TUTOR_FIELDS}
        record={editingTutor}
        onSubmit={handleSaveTutor}
        loading={saving}
      />

      <Dialog
        open={capacityOpen}
        onClose={handleCloseCapacity}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Capacidad{capacityTutor ? ` — ${capacityTutor.name}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          {capacityLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : capacityData ? (
            <Stack spacing={2}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Uso de capacidad
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {capacityData.usage_percentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(capacityData.usage_percentage, 100)}
                  color={capacityData.overloaded ? "error" : "primary"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Horas consumidas
                </Typography>
                <Typography variant="body2">
                  {capacityData.assigned_hours}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Capacidad máxima
                </Typography>
                <Typography variant="body2">
                  {capacityData.max_capacity}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Horas disponibles
                </Typography>
                <Typography variant="body2">
                  {capacityData.available_hours}
                </Typography>
              </Box>

              {capacityData.overloaded && (
                <Alert severity="warning">Este tutor está sobrecargado.</Alert>
              )}

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Grupos asignados ({capacityGroups.length})
                </Typography>
                {capacityGroups.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Sin grupos asignados.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {capacityGroups.map((group) => (
                      <ListItem key={group.id} disableGutters>
                        <ListItemText
                          primary={group.name}
                          secondary={`Estado: ${group.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCapacity}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}