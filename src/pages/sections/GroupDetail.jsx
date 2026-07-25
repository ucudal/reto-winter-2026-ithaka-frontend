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
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { getGroupById, updateGroupStage, updateGroupTutors } from "../../api/endpoints/groups";
import { getCohortById, getCohortStages } from "../../api/endpoints/cohorts";
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

      const [stagesData, tutorsData] = await Promise.all([
        getCohortStages(groupData.cohortId),
        getTutors(),
      ]);

      setStages(stagesData || []);
      setTutors(tutorsData || []);
    } catch (err) {
      setError(err?.message || "No se pudo cargar el grupo.");
    } finally {
      setLoading(false);
    }
  };

  const openStageDialog = () => {
    setSelectedStageId(group.currentStage?.id ?? "");
    setStageDialogOpen(true);
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

  const openTutorsDialog = () => {
    setSelectedBusinessTutorId(group.businessTutor?.id ?? "");
    setSelectedTechnicalTutorId(group.technicalTutor?.id ?? "");
    setTutorsDialogOpen(true);
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
              <Typography variant="body1">{group.idea || "Sin descripción."}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Etapa actual
                </Typography>
                <Button size="small" onClick={openStageDialog}>
                  Cambiar
                </Button>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {group.currentStage?.name || "Sin etapa asignada"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Tutores
                </Typography>
                <Button size="small" onClick={openTutorsDialog}>
                  Asignar
                </Button>
              </Box>
              <Typography variant="body2">
                <strong>Negocio:</strong> {group.businessTutor?.name || "Sin asignar"}
              </Typography>
              <Typography variant="body2">
                <strong>Técnico:</strong> {group.technicalTutor?.name || "Sin asignar"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Integrantes
              </Typography>
              {group.students.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sin integrantes registrados.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {group.students.map((student) => (
                    <ListItem key={student.id} disableGutters>
                      <ListItemText primary={student.name} />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStageDialogOpen(false)} disabled={savingStage}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveStage} disabled={savingStage || !selectedStageId}>
            {savingStage ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: asignar tutores */}
      <Dialog open={tutorsDialogOpen} onClose={() => setTutorsDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Asignar tutores</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTutorsDialogOpen(false)} disabled={savingTutors}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveTutors} disabled={savingTutors}>
            {savingTutors ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
