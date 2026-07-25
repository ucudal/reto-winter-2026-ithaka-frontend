import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { getGroupById, updateGroupStage, updateGroupTutors } from "../../api/endpoints/groups";
import { getCohortStages } from "../../api/endpoints/cohorts";
import { getTutors } from "../../api/endpoints/tutors";
import LoadingStateComponent from "../../components/LoadingStateComponent";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function GroupDetail() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [stages, setStages] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [error, setError] = useState("");

  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [savingStage, setSavingStage] = useState(false);

  const [tutorsDialogOpen, setTutorsDialogOpen] = useState(false);
  const [selectedBusinessTutorId, setSelectedBusinessTutorId] = useState("");
  const [selectedTechnicalTutorId, setSelectedTechnicalTutorId] = useState("");
  const [savingTutors, setSavingTutors] = useState(false);

  useEffect(() => {
    if (id) {
      loadGroup(Number(id));
    }
  }, [id]);

  const loadGroup = async (groupId) => {
    try {
      setLoading(true);
      setError("");

      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      setCohort(groupData.cohort);
    } catch (err) {
      setError(err?.message || "No se pudo cargar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  const openStageDialog = async () => {
    setSelectedStageId(group.currentStage?.id ?? "");
    setStageDialogOpen(true);
    if (stages.length === 0) {
      try {
        setLoadingStages(true);
        const stagesData = await getCohortStages(group.cohortId);
        setStages(stagesData || []);
      } catch (err) {
        console.error("Error al cargar etapas:", err);
      } finally {
        setLoadingStages(false);
      }
    }
  };

  const handleSaveStage = async () => {
    if (!selectedStageId) return;
    try {
      setSavingStage(true);
      const updated = await updateGroupStage(group.id, Number(selectedStageId));
      setGroup(updated);
      setStageDialogOpen(false);
    } catch (err) {
      setError(err?.message || "No se pudo actualizar la etapa.");
    } finally {
      setSavingStage(false);
    }
  };

  const openTutorsDialog = async () => {
    setSelectedBusinessTutorId(group.businessTutor?.id ?? "");
    setSelectedTechnicalTutorId(group.technicalTutor?.id ?? "");
    setTutorsDialogOpen(true);
    if (tutors.length === 0) {
      try {
        setLoadingTutors(true);
        const tutorsData = await getTutors();
        setTutors(tutorsData || []);
      } catch (err) {
        console.error("Error al cargar tutores:", err);
      } finally {
        setLoadingTutors(false);
      }
    }
  };

  const handleSaveTutors = async () => {
    try {
      setSavingTutors(true);
      const updated = await updateGroupTutors(group.id, {
        business_tutor_id: selectedBusinessTutorId || null,
        technical_tutor_id: selectedTechnicalTutorId || null,
      });
      setGroup(updated);
      setTutorsDialogOpen(false);
    } catch (err) {
      setError(err?.message || "No se pudieron actualizar los tutores.");
    } finally {
      setSavingTutors(false);
    }
  };

  if (loading) {
    return <LoadingStateComponent />;
  }

  if (error && !group) {
    return (
      <Box sx={{ width: "100%" }}>
        <ErrorState message={error} onRetry={() => loadGroup(Number(id))} />
      </Box>
    );
  }

  if (!group) {
    return (
      <Box sx={{ width: "100%" }}>
        <EmptyState
          title="Grupo no encontrado"
          description="El grupo que estás intentando ver no existe o fue eliminado."
        />
      </Box>
    );
  }

  const businessTutors = tutors.filter((t) => t.role === "Business");
  const technicalTutors = tutors.filter((t) => t.role === "Technical");

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Inicio
        </Link>
        <Link component={RouterLink} to="/groups" underline="hover" color="inherit">
          Grupos
        </Link>
        <Typography color="text.primary">{group.name}</Typography>
      </Breadcrumbs>

      {error && (
        <ErrorState message={error} onRetry={() => loadGroup(Number(id))} />
      )}

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">{group.name}</Typography>
          <Chip label={group.status} color="default" />
        </Box>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">
                Cohorte
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {cohort ? `${cohort.year} - ${cohort.semester}° semestre` : `#${group.cohortId}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">
                Carrera
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {group.major || "—"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block">
                Idea de proyecto
              </Typography>
              <Typography variant="body1">{group.idea || "Sin idea registrada"}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Tutores</Typography>
                <Button size="small" onClick={openTutorsDialog}>
                  Asignar tutores
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Tutor de negocio
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {group.businessTutor?.name || "Sin asignar"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Tutor técnico
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {group.technicalTutor?.name || "Sin asignar"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Etapa del proyecto</Typography>
                <Button size="small" onClick={openStageDialog}>
                  Cambiar etapa
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Etapa actual
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {group.currentStage?.name || "Sin etapa definida"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estudiantes
              </Typography>
              {group.students?.length === 0 ? (
                <EmptyState
                  title="No hay estudiantes"
                  description="Este grupo no tiene estudiantes asignados."
                />
              ) : (
                <List>
                  {group.students?.map((student) => (
                    <ListItem key={student.id} divider>
                      <ListItemText
                        primary={student.name}
                        secondary={`${student.email} — ${student.major || "Sin carrera"}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog: cambiar etapa */}
      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Cambiar etapa</DialogTitle>
        <DialogContent>
          {loadingStages ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              select
              label="Etapa"
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            >
              {stages.map((stage) => (
                <MenuItem key={stage.id} value={stage.id}>
                  {stage.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageDialogOpen(false)} disabled={savingStage}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveStage} disabled={savingStage || !selectedStageId || loadingStages}>
            {savingStage ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: asignar tutores */}
      <Dialog open={tutorsDialogOpen} onClose={() => setTutorsDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Asignar tutores</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {loadingTutors ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <TextField
                select
                label="Tutor de negocio"
                value={selectedBusinessTutorId}
                onChange={(e) => setSelectedBusinessTutorId(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {businessTutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Tutor técnico"
                value={selectedTechnicalTutorId}
                onChange={(e) => setSelectedTechnicalTutorId(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {technicalTutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorsDialogOpen(false)} disabled={savingTutors}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveTutors} disabled={savingTutors || loadingTutors}>
            {savingTutors ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
