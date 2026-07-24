import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useParams } from "react-router-dom";

const API_BASE = "/api";

export default function CohortLifecycleConfiguration() {
  const { id } = useParams();
  const cohortId = Number(id);

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [newStage, setNewStage] = useState({
    name: "",
    description: "",
    date: "",
  });

  const loadStages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/stages`);
      if (!res.ok) throw new Error(`Error ${res.status} al obtener etapas`);
      const all = await res.json();

      const cohortStages = all
        .filter((s) => s.cohort_id === cohortId)
        .sort((a, b) => a.order - b.order);

      setStages(cohortStages);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las etapas del cohorte.");
    } finally {
      setLoading(false);
    }
  }, [cohortId]);

  useEffect(() => {
    loadStages();
  }, [loadStages]);


  const upsertStage = async (stagePayload) => {
    const res = await fetch(`${API_BASE}/stages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stagePayload),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al guardar la etapa`);
    return res.json();
  };

  const handleAddStage = async () => {
    if (!newStage.name) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        cohort_id: cohortId,
        name: newStage.name,
        order: stages.length + 1,
        key_dates:
          newStage.description || newStage.date
            ? [
                {
                  description: newStage.description || null,
                  date: newStage.date || null,
                },
              ]
            : [],
      };

      const created = await upsertStage(payload);
      setStages((prev) => [...prev, created].sort((a, b) => a.order - b.order));

      setNewStage({ name: "", description: "", date: "" });
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar la etapa.");
    } finally {
      setSaving(false);
    }
  };

  const moveStage = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stages.length) return;

    const current = stages[index];
    const target = stages[newIndex];

    const updated = [...stages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setStages(updated);

    setSaving(true);
    setError(null);
    try {
      await Promise.all([
        upsertStage({ ...current, order: target.order }),
        upsertStage({ ...target, order: current.order }),
      ]);
      await loadStages();
    } catch (err) {
      console.error(err);
      setError("No se pudo reordenar las etapas. Reintentando cargar el estado actual.");
      loadStages();
    } finally {
      setSaving(false);
    }
  };

  const keyDateSummary = (stage) => {
    if (!stage.key_dates || stage.key_dates.length === 0) return null;
    const [first] = stage.key_dates;
    return (
      <>
        {first.description && (
          <Typography>{first.description}</Typography>
        )}
        {first.date && (
          <Typography variant="body2">Fecha: {first.date}</Typography>
        )}
      </>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Configuración del ciclo de vida del Cohorte {id}
      </Typography>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Etapas e hitos
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : stages.length === 0 ? (
          <Typography color="text.secondary">
            Este cohorte todavía no tiene etapas configuradas.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {stages.map((stage, index) => (
              <Paper
                key={stage.id}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography fontWeight="bold">
                    {index + 1}. {stage.name}
                  </Typography>
                  {keyDateSummary(stage)}
                </Box>

                <Box>
                  <IconButton
                    disabled={saving}
                    onClick={() => moveStage(index, -1)}
                  >
                    <ArrowUpwardIcon />
                  </IconButton>

                  <IconButton
                    disabled={saving}
                    onClick={() => moveStage(index, 1)}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Agregar nuevo hito
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nombre"
            value={newStage.name}
            onChange={(e) =>
              setNewStage({ ...newStage, name: e.target.value })
            }
            disabled={saving}
          />

          <TextField
            label="Descripción"
            value={newStage.description}
            onChange={(e) =>
              setNewStage({ ...newStage, description: e.target.value })
            }
            disabled={saving}
          />

          <TextField
            label="Fecha"
            type="date"
            value={newStage.date}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setNewStage({ ...newStage, date: e.target.value })
            }
            disabled={saving}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStage}
            disabled={saving || !newStage.name}
          >
            {saving ? "Guardando..." : "Agregar hito"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
