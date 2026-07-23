import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { getTutors, getTutorCapacity } from "../../api/endpoints/tutors";
import { getDashboardSummary } from "../../api/endpoints/dashboard";
import LoadingStateComponent from "../../components/LoadingStateComponent";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const USAGE_THRESHOLDS = {
  warning: 70,
  critical: 100,
};

function usageColor(usagePercentage) {
  if (usagePercentage >= USAGE_THRESHOLDS.critical) return "error";
  if (usagePercentage >= USAGE_THRESHOLDS.warning) return "warning";
  return "success";
}

const ALERT_CONFIG = {
  GroupWithoutTutor: {
    label: "Grupo sin tutor",
    icon: GroupRemoveIcon,
    severity: "error",
  },
  OverloadedTutor: {
    label: "Tutor sobrecargado",
    icon: WarningAmberIcon,
    severity: "warning",
  },
};

export default function TutorsCapacity() {
  const [tutorsCapacity, setTutorsCapacity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [tutorsData, summary] = await Promise.all([
        getTutors(),
        getDashboardSummary(),
      ]);

      const tutors = Array.isArray(tutorsData)
        ? tutorsData
        : (tutorsData?.items ?? []);

      const capacities = await Promise.all(
        tutors.map(async (tutor) => {
          try {
            const capacity = await getTutorCapacity(tutor.id);
            return { ...tutor, capacity };
          } catch {
            return { ...tutor, capacity: null };
          }
        }),
      );

      setTutorsCapacity(capacities);
      setAlerts(summary?.alerts ?? []);
    } catch (err) {
      setError(
        err?.message || "No se pudo cargar el panel de capacidad de tutores.",
      );
    } finally {
      setLoading(false);
    }
  }

  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => ALERT_CONFIG[alert.type]),
    [alerts],
  );

  if (loading) return <LoadingStateComponent />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <Box sx={{ width: "100%" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Inicio
        </Link>
        <Link component={RouterLink} to="/tutors" underline="hover" color="inherit">
          Tutores
        </Link>
        <Typography color="text.primary">Capacidad</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Capacidad de tutores
      </Typography>

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Alertas críticas
      </Typography>

      {criticalAlerts.length === 0 ? (
        <Alert severity="success" sx={{ mb: 4 }}>
          No hay alertas activas por el momento.
        </Alert>
      ) : (
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {criticalAlerts.map((alert, index) => {
            const config = ALERT_CONFIG[alert.type];
            const AlertIcon = config.icon;
            return (
              <Alert
                key={`${alert.type}-${alert.group_id ?? alert.tutor_id ?? index}`}
                severity={config.severity}
                icon={<AlertIcon fontSize="inherit" />}
              >
                <strong>{config.label}:</strong> {alert.description}
              </Alert>
            );
          })}
        </Stack>
      )}

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Uso de horas por tutor
      </Typography>

      {tutorsCapacity.length === 0 ? (
        <EmptyState title="No hay tutores para mostrar" />
      ) : (
        <Grid container spacing={2}>
          {tutorsCapacity.map((tutor) => {
            const capacity = tutor.capacity;
            const usagePercentage = capacity?.usage_percentage ?? 0;
            const color = usageColor(usagePercentage);

            return (
              <Grid item xs={12} sm={6} md={4} key={tutor.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {tutor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tutor.role}
                        </Typography>
                      </Box>
                      {capacity?.overloaded && (
                        <Chip size="small" color="error" label="Sobrecargado" />
                      )}
                    </Box>

                    {capacity ? (
                      <>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(usagePercentage, 100)}
                          color={color}
                          sx={{ height: 10, borderRadius: 5, mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {capacity.assigned_hours}h / {capacity.max_capacity}h
                          {" "}
                          ({usagePercentage}%)
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin datos de capacidad disponibles.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
