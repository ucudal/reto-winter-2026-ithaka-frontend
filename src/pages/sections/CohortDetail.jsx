import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GroupIcon from "@mui/icons-material/Group";
import RouteIcon from "@mui/icons-material/Route";

import {
  getCohortById,
  getCohortGroups,
  getCohortStages,
} from "../../api/endpoints/cohorts";
import { getStageExpectedDeliverables } from "../../api/endpoints/stages";
import EmptyState from "../../components/common/EmptyState";
import { sanitizeText } from "../../utils/sanitize";

const DELIVERABLE_STATUS = {
  Pending: { label: "Pendiente", color: "warning" },
  Submitted: { label: "Entregado", color: "info" },
  Delivered: { label: "Entregado", color: "info" },
  Approved: { label: "Aprobado", color: "success" },
  Rejected: { label: "Rechazado", color: "error" },
};

function getStatusChip(status) {
  return (
    DELIVERABLE_STATUS[status] || { label: status || "—", color: "default" }
  );
}

function formatExpectedDate(isoDate) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cohort-tabpanel-${index}`}
      aria-labelledby={`cohort-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CohortDetail() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [groups, setGroups] = useState([]);
  const [stages, setStages] = useState([]);
  const [deliverablesByStage, setDeliverablesByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      loadCohortData(Number(id));
    }
  }, [id]);

  const loadCohortData = async (cohortId) => {
    try {
      setLoading(true);
      setError("");

      const [cohortData, groupsData, stagesData] = await Promise.all([
        getCohortById(cohortId),
        getCohortGroups(cohortId),
        getCohortStages(cohortId),
      ]);

      setCohort(cohortData);
      setGroups(groupsData);

      // Sort stages by order
      const sortedStages = (stagesData || []).sort((a, b) => a.order - b.order);
      setStages(sortedStages);

      // Cargar los entregables esperados de cada etapa en paralelo.
      // Si una etapa falla, se deja vacía sin romper el resto.
      const deliverableEntries = await Promise.all(
        sortedStages.map(async (stage) => {
          try {
            const data = await getStageExpectedDeliverables(stage.id);
            return [stage.id, data || []];
          } catch {
            return [stage.id, []];
          }
        }),
      );
      setDeliverablesByStage(Object.fromEntries(deliverableEntries));
    } catch (err) {
      setError(
        err?.message || "No se pudieron cargar los detalles del cohorte.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!cohort) {
    return (
      <Box sx={{ width: "100%" }}>
        <EmptyState
          title="Cohorte no encontrado"
          description="El cohorte que estás intentando ver no existe o fue eliminado."
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Inicio
        </Link>
        <Link
          component={RouterLink}
          to="/cohorts"
          underline="hover"
          color="inherit"
        >
          Cohortes
        </Link>
        <Typography color="text.primary">Detalle</Typography>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">
            Cohorte {cohort.year} - {cohort.semester}° semestre
          </Typography>
          <Chip
            label={cohort.status === "Active" ? "Activo" : "Inactivo"}
            color={cohort.status === "Active" ? "success" : "default"}
          />
        </Box>
      </Box>

      {/* Info Card */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Fecha de Inicio
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {cohort.start_date}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Fecha de Fin
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {cohort.end_date || "En curso"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Cantidad de Grupos
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {groups.length} grupos
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Notas / Descripción
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {cohort.notes
                  ? sanitizeText(cohort.notes)
                  : "Sin notas adicionales."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Detalles de cohorte tabs"
        >
          <Tab
            icon={<GroupIcon />}
            iconPosition="start"
            label="Grupos"
            id="cohort-tab-0"
          />
          <Tab
            icon={<RouteIcon />}
            iconPosition="start"
            label="Etapas del Proceso"
            id="cohort-tab-1"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <CustomTabPanel value={tabValue} index={0}>
        <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
          {groups.length === 0 ? (
            <EmptyState
              title="No hay grupos asignados"
              description="Aún no se han configurado equipos para este cohorte."
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Nombre del Grupo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id} hover>
                      <TableCell>{group.id}</TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        <Link
                          component={RouterLink}
                          to={`/groups/${group.id}`}
                          underline="hover"
                        >
                          {group.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            group.status === "Active" ? "Activo" : group.status
                          }
                          size="small"
                          color={
                            group.status === "Active" ? "success" : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {stages.length === 0 ? (
            <EmptyState
              title="No hay etapas definidas"
              description="No hay un flujo de etapas configurado para este cohorte."
            />
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {stages.map((stage, idx) => {
                const deliverables = deliverablesByStage[stage.id] || [];

                return (
                  <Card
                    key={stage.id}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    <CardContent sx={{ py: "16px !important" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {stage.order}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {stage.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Paso número {idx + 1} en el ciclo de vida del
                            proyecto
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2, pl: { xs: 0, sm: 9 } }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Entregables esperados
                        </Typography>

                        {deliverables.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No hay entregables esperados para esta etapa.
                          </Typography>
                        ) : (
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Grupo
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Fecha esperada
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Estado
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {deliverables.map((deliverable) => {
                                  const statusChip = getStatusChip(
                                    deliverable.status,
                                  );

                                  return (
                                    <TableRow key={deliverable.id} hover>
                                      <TableCell>
                                        Grupo #{deliverable.group_id}
                                      </TableCell>
                                      <TableCell>
                                        {formatExpectedDate(
                                          deliverable.expected_date,
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={statusChip.label}
                                          size="small"
                                          color={statusChip.color}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Paper>
      </CustomTabPanel>
    </Box>
  );
}
