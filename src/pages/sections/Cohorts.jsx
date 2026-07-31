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
  Chip,
  IconButton,
  Breadcrumbs,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  FormControl,
  Stack,
  InputLabel,
  InputAdornment,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import { getCohorts, createCohort, updateCohort } from "../../api/endpoints/cohorts";
import { translateStatus } from "../../utils/translate";
import { useToast } from "../../ToastContext";
import EmptyState from "../../components/common/EmptyState";

export default function Cohorts() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("list");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Action Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);

  // State for Create/Edit Cohort Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCohortId, setEditingCohortId] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    semester: 1,
    start_date: "",
    end_date: "",
    status: "Active",
    notes: "",
  });

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (filterYear && filterYear.length < 3) {
      return;
    }
    let ignore = false;

    loadCohorts({
      year: filterYear || undefined,
      semester: filterSemester || undefined,
      status: filterStatus || undefined,
      page: page + 1,
      page_size: rowsPerPage,
    },
    () => ignore
    );
    return () => {
      ignore = true;
    };
  }, [filterYear, filterSemester, filterStatus, page, rowsPerPage]);

  async function loadCohorts(filters = {}, shouldIgnore = () => false) {
    try {
      setLoading(true);
      setError("");
      const res = await getCohorts(filters);
      if (shouldIgnore()) return;
      setCohorts(res?.items ?? (Array.isArray(res) ? res : []));
      setTotalCount(res?.total ?? (Array.isArray(res) ? res.length : 0));
    } catch (err) {
      if (shouldIgnore()) return;
      setError(err?.message || "No se pudieron cargar los cohortes.");
    } finally {
      if (!shouldIgnore()) {
        setLoading(false);
      }
    }
  }

  const handleMenuOpen = (event, cohort) => {
    setAnchorEl(event.currentTarget);
    setSelectedCohort(cohort);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCohort(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCreateDialog = () => {
    setEditingCohortId(null);
    setFormData({
      year: new Date().getFullYear(),
      semester: 1,
      start_date: "",
      end_date: "",
      status: "Active",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cohort) => {
    handleMenuClose();
    setEditingCohortId(cohort.id);
    setFormData({
      year: cohort.year,
      semester: cohort.semester,
      start_date: cohort.start_date || "",
      end_date: cohort.end_date || "",
      status: cohort.status || "Active",
      notes: cohort.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCohortId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCohortId) {
        await updateCohort(editingCohortId, formData);
        showToast("Cohorte actualizado exitosamente", "success");
      } else {
        await createCohort(formData);
        showToast("Cohorte creado exitosamente", "success");
      }
      setIsDialogOpen(false);
      setEditingCohortId(null);
      loadCohorts({
        year: filterYear || undefined,
        semester: filterSemester || undefined,
        status: filterStatus || undefined,
        page: 1,
        page_size: 20,
      });
    } catch (err) {
      showToast(err?.message || "Error al guardar el cohorte", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cohort) => {
    handleMenuClose();
    const newStatus = cohort.status === "Active" ? "Inactive" : "Active";
    try {
      await updateCohort(cohort.id, {
        year: cohort.year,
        semester: cohort.semester,
        start_date: cohort.start_date,
        end_date: cohort.end_date,
        status: newStatus,
        notes: cohort.notes,
      });
      showToast(
        `Cohorte marcado como ${translateStatus(newStatus)}`,
        "success"
      );
      loadCohorts({
        year: filterYear || undefined,
        semester: filterSemester || undefined,
        status: filterStatus || undefined,
        page: 1,
        page_size: 20,
      });
    } catch (err) {
      showToast(err?.message || "Error al cambiar el estado del cohorte", "error");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Typography color="text.primary">Cohortes</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">Cohortes</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="cohorts-view-label">Vista</InputLabel>
            <Select
              labelId="cohorts-view-label"
              id="cohorts-view"
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
            onClick={handleOpenCreateDialog}
          >
            Agregar cohorte
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "stretch", flexWrap: "wrap" }}>
          <TextField
            label="Año"
            type="text"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{ width: 180 }}
          />

          <TextField
            select
            label="Semestre"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value={1}>1° Semestre</MenuItem>
            <MenuItem value={2}>2° Semestre</MenuItem>
          </TextField>

          <TextField
            select
            label="Estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: 220 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Planned">Planificado</MenuItem>
            <MenuItem value="Active">Activo</MenuItem>
            <MenuItem value="Finished">Finalizado</MenuItem>
            <MenuItem value="Inactive">Inactivo</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : cohorts.length === 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 2 }}>
          <EmptyState
            title="No hay cohortes"
            description="No se encontraron cohortes cargados en el sistema."
          />
        </Paper>
      ) : view === "list" ? (
        <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Año</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Semestre</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Fecha de Inicio</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Fecha de Fin</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Grupos</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Notas</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cohorts.map((cohort) => (
                  <TableRow key={cohort.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>{cohort.year}</TableCell>
                    <TableCell>{cohort.semester}° semestre</TableCell>
                    <TableCell>{cohort.start_date}</TableCell>
                    <TableCell>{cohort.end_date || "-"}</TableCell>
                    <TableCell>{cohort.group_count ?? 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={translateStatus(cohort.status)}
                        size="small"
                        color={cohort.status === "Active" ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cohort.notes || "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Opciones">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, cohort)}
                          aria-label="Opciones"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
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
        </Paper>
      ) : (
        <Box>
          <Grid container spacing={3}>
            {cohorts.map((cohort) => (
              <Grid item xs={12} sm={6} md={4} key={cohort.id}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Cohorte {cohort.year} - {cohort.semester}° Semestre
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {cohort.start_date} a {cohort.end_date || "Finalización"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Grupos asignados: {cohort.group_count ?? 0}
                        </Typography>
                      </Box>
                    </Stack>

                    {cohort.notes && (
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }} color="text.secondary">
                        "{cohort.notes}"
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Chip
                      label={translateStatus(cohort.status)}
                      size="small"
                      color={cohort.status === "Active" ? "success" : "default"}
                    />
                    <Tooltip title="Opciones">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, cohort)}
                        aria-label="Opciones"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      {/* Action Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 180, borderRadius: 2 },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedCohort) {
              navigate(`/cohorts/${selectedCohort.id}`);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedCohort) {
              handleOpenEditDialog(selectedCohort);
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Editar cohorte</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedCohort) {
              navigate(`/cohorts/${selectedCohort.id}/configuration`);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Configurar cohorte</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedCohort) {
              handleToggleStatus(selectedCohort);
            }
          }}
        >
          <ListItemIcon>
            {selectedCohort?.status === "Active" ? (
              <BlockIcon fontSize="small" color="error" />
            ) : (
              <CheckCircleOutlineIcon fontSize="small" color="success" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedCohort?.status === "Active" ? "Dar de baja" : "Activar cohorte"}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Create / Edit Cohort Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCohortId ? "Editar cohorte" : "Agregar nuevo cohorte"}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField
                label="Año"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                select
                label="Semestre"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
                fullWidth
              >
                <MenuItem value={1}>1° Semestre</MenuItem>
                <MenuItem value={2}>2° Semestre</MenuItem>
              </TextField>
              <TextField
                label="Fecha de Inicio"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Fecha de Fin"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                select
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                fullWidth
              >
                <MenuItem value="Planned">Planificado</MenuItem>
                <MenuItem value="Active">Activo</MenuItem>
                <MenuItem value="Finished">Finalizado</MenuItem>
                <MenuItem value="Inactive">Inactivo</MenuItem>
              </TextField>
              <TextField
                label="Notas / Descripción"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
