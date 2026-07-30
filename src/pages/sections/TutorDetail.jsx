import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Avatar,
  Chip,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { getTutor, getTutorCapacity, upsertTutor, deleteTutor } from "../../api/endpoints/tutors";
import { translateStatus, translateTutorRole } from "../../utils/translate";
import { useToast } from "../../ToastContext";
import GenericEditModal from "../../components/common/GenericEditModal";

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
  {
    name: "availability",
    label: "Disponibilidad",
    type: "text",
    required: true,
    grid: 12,
    validate: (value) =>
      /^\d+$/.test(String(value).trim())
        ? "Ingresá días/horarios, no un número suelto"
        : "",
  },
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

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [tutor, setTutor] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tutorData, capacityData] = await Promise.all([
        getTutor(id),
        getTutorCapacity(id),
      ]);
      setTutor(tutorData);
      setCapacity(capacityData);
    } catch (err) {
      setError(
        err?.message || "No se pudo cargar el perfil del tutor."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSaveTutor = async (data) => {
    const payload = {
      id: tutor.id,
      name: data.name,
      role: data.role,
      specialty: data.specialty || null,
      availability: data.availability || null,
      status: data.status,
      max_capacity: Number(data.max_capacity),
      linkedin_url: data.linkedin_url || null,
    };

    try {
      setSaving(true);
      await upsertTutor(payload);
      showToast("Tutor actualizado correctamente.", "success");
      setModalOpen(false);
      await loadData();
    } catch (err) {
      showToast(err?.message || "No se pudo actualizar el tutor.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTutor = async () => {
    try {
      setDeleting(true);
      await deleteTutor(tutor);
      showToast("Tutor eliminado correctamente.", "success");
      navigate("/tutors");
    } catch (err) {
      showToast(err?.message || "No se pudo eliminar el tutor.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const percentage = capacity?.usage_percentage ?? 0;

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          component={RouterLink}
          to="/tutors"
          underline="hover"
          color="inherit"
        >
          Tutores
        </Link>

        <Typography color="text.primary">
          Detalle del tutor
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">
          Perfil del tutor
        </Typography>

        {tutor && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setModalOpen(true)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Eliminar
            </Button>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                  {getInitials(tutor.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{tutor.name}</Typography>
                  <Chip
                    label={translateTutorRole(tutor.role)}
                    size="small"
                    color={tutor.role === "Business" ? "primary" : "info"}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Estado</Typography>
                  <Typography>
                    <Chip
                      label={translateStatus(tutor.status)}
                      size="small"
                      color={tutor.status === "Active" ? "success" : "default"}
                    />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Especialidad</Typography>
                  <Typography>{tutor.specialty || "-"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Disponibilidad</Typography>
                  <Typography>{tutor.availability || "-"}</Typography>
                </Box>
                {tutor.linkedin_url && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">LinkedIn</Typography>
                    <Box>
                      <Tooltip title="Abrir LinkedIn">
                        <IconButton
                          size="small"
                          color="primary"
                          component="a"
                          href={tutor.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedInIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6">
                Capacidad del tutor
              </Typography>

              <Card sx={{ mt: 2 }} variant="outlined">
                <CardContent>
                  <Typography>
                    Capacidad máxima:
                    <strong> {capacity.max_capacity} hs</strong>
                  </Typography>

                  <Typography>
                    Horas asignadas:
                    <strong> {capacity.assigned_hours} hs</strong>
                  </Typography>

                  <Typography>
                    Horas disponibles:
                    <strong> {capacity.available_hours} hs</strong>
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ mb: 1 }}>
                      Uso de capacidad: {percentage.toFixed(1)}%
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      color={capacity.overloaded ? "error" : "primary"}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      )}

      <GenericEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Editar tutor"
        fields={TUTOR_FIELDS}
        record={tutor}
        onSubmit={handleSaveTutor}
        loading={saving}
      />

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Eliminar tutor</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Desea eliminar a <strong>{tutor?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteTutor}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
