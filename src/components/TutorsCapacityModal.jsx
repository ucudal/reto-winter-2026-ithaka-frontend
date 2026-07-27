import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

export default function TutorsCapacityModal({ open, onClose }) {
  const [tutorsCapacity, setTutorsCapacity] = useState([]);
  const [overallCapacity, setOverallCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) loadData();
  }, [open]);

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
      setError(
        err?.message || "No se pudo cargar el panel de capacidad de tutores.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Capacidad de tutores
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <LoadingStateComponent />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : (
          <>

            {tutorsCapacity.length === 0 ? (
              <EmptyState title="No hay tutores para mostrar" />
            ) : (
              <Grid container spacing={2}>
                {tutorsCapacity.map((tutor) => {
                  const capacity = tutor.capacity;
                  const usagePercentage = capacity?.usage_percentage ?? 0;
                  const color = usageColor(usagePercentage);

                  return (
                    <Grid item xs={12} sm={6} key={tutor.id}>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
