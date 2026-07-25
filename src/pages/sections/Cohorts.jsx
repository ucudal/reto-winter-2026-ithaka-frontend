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
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

import { getCohorts, createCohort } from "../../api/endpoints/cohorts";
import { useToast } from "../../ToastContext";
import EmptyState from "../../components/common/EmptyState";

export default function Cohorts() {
  const { showToast } = useToast();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("list");

  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // State for Create Cohort Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    semester: 1,
    start_date: "",
    end_date: "",
    notes: "",
  });

  useEffect(() => {
    if (filterYear && filterYear.length < 3) {
      return;
    }

    loadCohorts({
      year: filterYear || undefined,
      semester: filterSemester || undefined,
      status: filterStatus || undefined,
      page: 1,
      page_size: 20,
    });
  }, [filterYear, filterSemester, filterStatus]);

  async function loadCohorts(filters = {}) {
    try {
      setLoading(true);
      setError("");
      const data = await getCohorts(filters);
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      setCohorts(items);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los cohortes.");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenDialog = () => {
    setFormData({
      year: new Date().getFullYear(),
      semester: 1,
      start_date: "",
      end_date: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createCohort(formData);
      showToast("Cohorte creado exitosamente", "success");
      setIsDialogOpen(false);
      loadCohorts({
        year: filterYear || undefined,
        semester: filterSemester || undefined,
        status: filterStatus || undefined,
        page: 1,
        page_size: 20,
      });
    } catch (err) {
      showToast(err?.message || "Error al crear el cohorte", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Inicio
        </Link>
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
            onClick={handleOpenDialog}
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
            <MenuItem value="Active">Activo</MenuItem>
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
                        label={cohort.status === "Active" ? "Activo" : "Inactivo"}
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
                      <IconButton
                        size="small"
                        color="primary"
                        component={RouterLink}
                        to={`/cohorts/${cohort.id}`}
                        aria-label="Ver detalles"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="primary"
                        component={RouterLink}
                        to={`/cohorts/${cohort.id}/configuration`}
                        aria-label="Configurar cohorte"
                      >
                        <SettingsIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
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
                    label={cohort.status === "Active" ? "Activo" : "Inactivo"}
                    size="small"
                    color={cohort.status === "Active" ? "success" : "default"}
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/cohorts/${cohort.id}`}
                    aria-label="Ver detalles"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Cohort Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Agregar nuevo cohorte</DialogTitle>
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
            <Button onClick={handleCloseDialog} disabled={isCreating}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isCreating}>
              {isCreating ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}