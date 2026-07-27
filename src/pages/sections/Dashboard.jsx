import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";

import { getDashboardSummary } from "../../api/endpoints/dashboard";
import EmptyState from "../../components/common/EmptyState";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos del resumen del Dashboard.");
    } finally {
      setLoading(false);
    }
  }

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

  const {
    active_groups = 0,
    active_tutors = 0,
    groups_by_stage = [],
    capacity = { total_available_hours: 0, total_used_hours: 0, usage_percentage: 0 },
    pending_deliverables = 0,
    alerts = [],
  } = summary || {};

  const totalStageGroups = groups_by_stage.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Typography color="text.primary">Resumen</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Panel Principal
      </Typography>

      {/* Metric Cards Top Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.main",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <GroupIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Grupos Activos
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {active_groups}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "info.light",
                  color: "info.main",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <SupervisorAccountIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tutores Activos
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {active_tutors}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "warning.light",
                  color: "warning.main",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                }}
              >
                <AssignmentLateIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Entregables Pendientes
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {pending_deliverables}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Row: Capacity & Stage Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Capacity Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Capacidad y Horas de Tutoría
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Consumo Total de Horas
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {capacity.total_used_hours} / {capacity.total_available_hours} hs (
                    {capacity.usage_percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(capacity.usage_percentage, 100)}
                  color={
                    capacity.usage_percentage > 90
                      ? "error"
                      : capacity.usage_percentage > 75
                      ? "warning"
                      : "primary"
                  }
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Horas Disponibles
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {capacity.total_available_hours} hs
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Horas Consumidas
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {capacity.total_used_hours} hs
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Groups by Stage Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <FolderSpecialIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Distribución de Grupos por Etapa
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {groups_by_stage.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay etapas activas con grupos.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {groups_by_stage.map((item, idx) => {
                    const percentage = totalStageGroups
                      ? Math.round((item.count / totalStageGroups) * 100)
                      : 0;

                    return (
                      <Box key={idx}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {item.stage}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.count} grupo{item.count === 1 ? "" : "s"} ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row: System Alerts */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <WarningAmberIcon color="warning" />
          <Typography variant="h6" fontWeight="bold">
            Alertas del Sistema
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {alerts.length === 0 ? (
          <EmptyState
            title="Sin alertas pendientes"
            description="Todos los grupos tienen sus tutores asignados y ningún tutor ha superado su capacidad."
          />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo de Alerta</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Referencia</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Chip
                        label={
                          alert.type === "GroupWithoutTutor"
                            ? "Grupo sin Tutor"
                            : alert.type === "OverloadedTutor"
                            ? "Tutor Sobrecargado"
                            : alert.type
                        }
                        size="small"
                        color={alert.type === "OverloadedTutor" ? "error" : "warning"}
                      />
                    </TableCell>
                    <TableCell>
                      {alert.group_id ? (
                        <Link
                          component={RouterLink}
                          to={`/groups/${alert.group_id}`}
                          underline="hover"
                        >
                          Grupo #{alert.group_id}
                        </Link>
                      ) : alert.tutor_id ? (
                        <Typography variant="body2">Tutor #{alert.tutor_id}</Typography>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{alert.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
