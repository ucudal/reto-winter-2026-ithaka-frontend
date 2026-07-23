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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { getCohorts, createCohort } from "../../api/endpoints/cohorts";
import { useToast } from "../../ToastContext";
import EmptyState from "../../components/common/EmptyState";

export default function Cohorts() {
  const { showToast } = useToast();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!isCreating) {
      setIsDialogOpen(false);
    }
  };

  const handleCreateCohortSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const payload = {
        year: Number(formData.year),
        semester: Number(formData.semester),
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        notes: formData.notes || null,
      };
      await createCohort(payload);
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
          alignItems: "flex-end",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4">Cohortes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 40 }}
          onClick={handleOpenDialog}
        >
          Agregar cohorte
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Año"
            type="number"
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

      <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : cohorts.length === 0 ? (
          <EmptyState
            title="No hay cohortes"
            description="No se encontraron cohortes cargados en el sistema."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Año</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Semestre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Fecha de Inicio
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Fecha de Fin
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Grupos</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Notas</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cohorts.map((cohort) => (
                  <TableRow key={cohort.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {cohort.year}
                    </TableCell>
                    <TableCell>{cohort.semester}° semestre</TableCell>
                    <TableCell>{cohort.start_date}</TableCell>
                    <TableCell>{cohort.end_date || "-"}</TableCell>
                    <TableCell>{cohort.group_count ?? 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          cohort.status === "Active" ? "Activo" : "Inactivo"
                        }
                        size="small"
                        color={
                          cohort.status === "Active" ? "success" : "default"
                        }
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Cohort Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCreateCohortSubmit}>
          <DialogTitle>Nuevo Cohorte</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Año"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Semestre"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value={1}>1° Semestre</MenuItem>
                  <MenuItem value={2}>2° Semestre</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Inicio"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Fin"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notas"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
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
