import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Avatar,
  Tooltip,
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
  Menu,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import {
  getGroupById,
  updateGroupStage,
  updateGroupTutors,
  getGroupDeliverables,
} from "../../api/endpoints/groups";
import { updateDeliverable } from "../../api/endpoints/deliverables";
import { getCohortStages } from "../../api/endpoints/cohorts";
import { getTutors } from "../../api/endpoints/tutors";
import LoadingStateComponent from "../../components/LoadingStateComponent";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../ToastContext";
import CommentFeed from "../../components/CommentFeed";

const CARD_SX = {
  borderRadius: 2,
  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
  border: "1px solid",
  borderColor: "divider",
  height: "100%",
};

const DELIVERABLE_STATUS = {
  Pending: { label: "Pendiente", color: "warning" },
  Submitted: { label: "Entregado", color: "info" },
  Delivered: { label: "Entregado", color: "info" },
  Approved: { label: "Aprobado", color: "success" },
  Rejected: { label: "Rechazado", color: "error" },
};

function isDeliverableOverdue(deliverable) {
  if (!deliverable.expectedDate) return false;
  if (["Delivered", "Approved"].includes(deliverable.status)) return false;
  return new Date(deliverable.expectedDate) < new Date(new Date().toDateString());
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function GroupDetail() {
  const { id } = useParams();
  const location = useLocation();
  const highlightDeliverableId = location.state?.highlightDeliverableId ?? null;
  const highlightedRowRef = useRef(null);
  const { showToast } = useToast();

  const [group, setGroup] = useState(null);
  const [cohort, setCohort] = useState(null);
  const [stages, setStages] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStages, setLoadingStages] = useState(false);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [loadingDeliverables, setLoadingDeliverables] = useState(false);
  const [error, setError] = useState("");

  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [statusMenuDeliverable, setStatusMenuDeliverable] = useState(null);
  const [updatingDeliverableId, setUpdatingDeliverableId] = useState(null);

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
      loadDeliverables(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (highlightDeliverableId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightDeliverableId, deliverables]);

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

  const loadDeliverables = async (groupId) => {
    try {
      setLoadingDeliverables(true);
      const data = await getGroupDeliverables(groupId);
      setDeliverables(data || []);
    } catch (err) {
      console.error("Error al cargar entregables:", err);
    } finally {
      setLoadingDeliverables(false);
    }
  };

  const openStatusMenu = (event, deliverable) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
    setStatusMenuDeliverable(deliverable);
  };

  const closeStatusMenu = () => {
    setStatusMenuAnchor(null);
    setStatusMenuDeliverable(null);
  };

  const handleChangeDeliverableStatus = async (newStatus) => {
    if (!statusMenuDeliverable || newStatus === statusMenuDeliverable.status) {
      closeStatusMenu();
      return;
    }
    const deliverableId = statusMenuDeliverable.id;
    closeStatusMenu();
    try {
      setUpdatingDeliverableId(deliverableId);
      const updated = await updateDeliverable(deliverableId, { status: newStatus });
      setDeliverables((prev) =>
        prev.map((d) => (d.id === deliverableId ? { ...d, status: updated.status } : d)),
      );
      showToast("Estado del entregable actualizado.", "success");
    } catch (err) {
      showToast(err?.message || "No se pudo actualizar el estado del entregable.", "error");
    } finally {
      setUpdatingDeliverableId(null);
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
  const nextKeyDate = group.currentStage?.key_dates?.[0];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 1.5 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 0.5 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit" variant="body2">
            Inicio
          </Link>
          <Link component={RouterLink} to="/groups" underline="hover" color="inherit" variant="body2">
            Grupos
          </Link>
          <Typography color="text.primary" variant="body2">
            {group.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "grey.300",
              color: "text.secondary",
              fontWeight: "bold",
            }}
          >
            {group.name ? group.name[0].toUpperCase() : "G"}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {group.name}
          </Typography>
          <Chip
            label={group.status === "Active" ? "Activo" : group.status}
            color={group.status === "Active" ? "success" : "default"}
            size="small"
          />
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 1.5 }}>
          <ErrorState message={error} onRetry={() => loadGroup(Number(id))} />
        </Box>
      )}

      {/* Datos rápidos */}
      <Card sx={{ ...CARD_SX, mb: 1.5 }}>
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary" display="block">
                Cohorte
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {cohort ? `${cohort.year} - ${cohort.semester}° semestre` : `#${group.cohortId}`}
              </Typography>
              {cohort?.start_date && (
                <Typography variant="caption" color="text.secondary">
                  {cohort.start_date}
                  {cohort.end_date ? ` al ${cohort.end_date}` : ""}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary" display="block">
                Carrera
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {group.major || "—"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary" display="block">
                Idea de proyecto
              </Typography>
              <Tooltip title={group.idea || ""} disableHoverListener={!group.idea}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {group.idea || "Sin idea registrada"}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tutores + Etapa */}
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Tutores
                </Typography>
                <Button size="small" onClick={openTutorsDialog}>
                  Asignar
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "secondary.light" }}>
                      {getInitials(group.businessTutor?.name)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      Negocio
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {group.businessTutor?.name || "Sin asignar"}
                  </Typography>
                  {group.businessTutor?.specialty && (
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {group.businessTutor.specialty}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "info.light" }}>
                      {getInitials(group.technicalTutor?.name)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      Técnico
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {group.technicalTutor?.name || "Sin asignar"}
                  </Typography>
                  {group.technicalTutor?.specialty && (
                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      {group.technicalTutor.specialty}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Etapa del proyecto
                </Typography>
                <Button size="small" onClick={openStageDialog}>
                  Cambiar
                </Button>
              </Box>
              <Chip
                label={group.currentStage?.name || "Sin etapa definida"}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
              {nextKeyDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {nextKeyDate.description}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {nextKeyDate.date}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estudiantes + Entregables */}
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Estudiantes ({group.students?.length ?? 0})
              </Typography>
              {group.students?.length === 0 ? (
                <EmptyState
                  title="No hay estudiantes"
                  description="Este grupo no tiene estudiantes asignados."
                />
              ) : (
                <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                  <List dense disablePadding>
                    {group.students?.map((student) => (
                      <ListItem key={student.id} divider sx={{ px: 0 }}>
                        <Avatar
                          sx={{ width: 28, height: 28, fontSize: 12, mr: 1.5, bgcolor: "primary.light" }}
                        >
                          {getInitials(student.name)}
                        </Avatar>
                        <ListItemText
                          primary={student.name}
                          secondary={`${student.email} — ${student.major || "Sin carrera"}`}
                          primaryTypographyProps={{ variant: "body2" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={CARD_SX}>
            <CardContent sx={{ pb: "12px !important" }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Entregables ({deliverables.length})
              </Typography>
              {loadingDeliverables ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : deliverables.length === 0 ? (
                <EmptyState
                  title="Sin entregables registrados"
                  description="Este grupo todavía no tiene entregables cargados."
                />
              ) : (
                <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                  <List dense disablePadding>
                    {deliverables.map((deliverable) => {
                      const statusMeta =
                        DELIVERABLE_STATUS[deliverable.status] || {
                          label: deliverable.status,
                          color: "default",
                        };
                      const overdue = isDeliverableOverdue(deliverable);
                      const isHighlighted = deliverable.id === highlightDeliverableId;

                      return (
                        <ListItem
                          key={deliverable.id}
                          divider
                          ref={isHighlighted ? highlightedRowRef : null}
                          sx={{
                            px: 1,
                            borderRadius: 1,
                            bgcolor: isHighlighted ? "warning.light" : "transparent",
                            transition: "background-color 0.3s",
                            display: "block",
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                <Typography variant="body2" fontWeight={500}>
                                  {deliverable.stageName || `Etapa #${deliverable.stageId}`}
                                </Typography>

                                <Chip
                                  label={statusMeta.label}
                                  color={statusMeta.color}
                                  size="small"
                                  onClick={(e) => openStatusMenu(e, deliverable)}
                                  disabled={updatingDeliverableId === deliverable.id}
                                  icon={
                                    updatingDeliverableId === deliverable.id ? (
                                      <CircularProgress size={12} sx={{ color: "inherit" }} />
                                    ) : undefined
                                  }
                                />

                                {overdue && (
                                  <Chip
                                    label="Vencido"
                                    color="error"
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                            secondary={`Fecha esperada: ${deliverable.expectedDate}`}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />

                          <Box sx={{ mt: 2 }}>
                            <CommentFeed deliverableId={deliverable.id} />
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menú: cambiar estado de un entregable */}
      <Menu anchorEl={statusMenuAnchor} open={Boolean(statusMenuAnchor)} onClose={closeStatusMenu}>
        {Object.entries(DELIVERABLE_STATUS).map(([statusKey, meta]) => (
          <MenuItem
            key={statusKey}
            selected={statusMenuDeliverable?.status === statusKey}
            onClick={() => handleChangeDeliverableStatus(statusKey)}
          >
            {meta.label}
          </MenuItem>
        ))}
      </Menu>

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
