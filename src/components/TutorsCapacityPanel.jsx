import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

import { getTutors, getTutorCapacity } from "../api/endpoints/tutors";
import { getDashboardSummary } from "../api/endpoints/dashboard";
import LoadingStateComponent from "./LoadingStateComponent";
import ErrorState from "./common/ErrorState";
import EmptyState from "./common/EmptyState";

const USAGE_THRESHOLDS = {
  warning: 70,
  critical: 100,
};

function usageColor(usagePercentage) {
  if (usagePercentage >= USAGE_THRESHOLDS.critical) return "error";
  if (usagePercentage >= USAGE_THRESHOLDS.warning) return "warning";
  return "success";
}

export default function TutorsCapacityPanel() {
  const [tutorsCapacity, setTutorsCapacity] = useState([]);
  const [overallCapacity, setOverallCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const tutors = await getTutors();

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

      getDashboardSummary()
        .then((summary) => setOverallCapacity(summary?.capacity ?? null))
        .catch(() => setOverallCapacity(null));
    } catch (err) {
      setError(err?.message || "No se pudo cargar la capacidad de tutores.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingStateComponent />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, p: 2, mb: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Capacidad de tutores
      </Typography>

      {overallCapacity && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Uso general del sistema:{" "}
            <strong>
              {overallCapacity.total_used_hours}h / {overallCapacity.total_available_hours}h
            </strong>{" "}
            ({overallCapacity.usage_percentage}%)
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

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
                          {tutor.specialty ? ` · ${tutor.specialty}` : ""}
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
                          {capacity.assigned_hours}h / {capacity.max_capacity}h ({usagePercentage}%)
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
    </Paper>
  );
}
