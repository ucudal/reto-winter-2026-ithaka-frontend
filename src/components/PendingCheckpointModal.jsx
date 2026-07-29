import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Rating,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

export default function PendingCheckpointModal({
  open,
  checkpoint,
  onClose,
  onSubmitSuccess,
}) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!checkpoint) return null;

  const handleValueChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedQuestions = checkpoint.questions.map((q) => ({
        id: q.id,
        text: q.text,
        answer: answers[q.id] != null ? String(answers[q.id]) : q.answer ?? null,
      }));

      const payload = {
        status: "Completed",
        questions: updatedQuestions,
      };

      if (onSubmitSuccess) {
        await onSubmitSuccess(checkpoint.id, payload);
      }
      onClose();
    } catch (err) {
      setError(err?.message || "No se pudo guardar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  // Calcular días restantes de vigencia
  const getDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining(checkpoint.due_date);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssignmentTurnedInIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {checkpoint.title || "Checkpoint Trimestral"}
            </Typography>
          </Box>
          {daysRemaining !== null && (
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label={`Vence en ${daysRemaining} días`}
              color={daysRemaining <= 3 ? "error" : "warning"}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" paragraph>
          Por favor, completa este breve formulario de evaluación correspondiente al avance de tu grupo en la cohorte actual.
        </Typography>

        <Stack spacing={3} sx={{ mt: 1 }}>
          {(checkpoint.questions || []).map((question) => (
            <Box key={question.id} sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {question.text}
              </Typography>

              {/* Si es pregunta de si/no (ID 1) */}
              {question.id === 1 && (
                <RadioGroup
                  row
                  value={answers[question.id] || ""}
                  onChange={(e) => handleValueChange(question.id, e.target.value)}
                >
                  <FormControlLabel value="Si" control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              )}

              {/* Si es pregunta de texto/bloqueos (ID 2) */}
              {question.id === 2 && (
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Describe brevemente si hay algún obstáculo..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleValueChange(question.id, e.target.value)}
                  sx={{ mt: 1, bg: "background.paper" }}
                />
              )}

              {/* Si es calificación del 1 al 5 (ID 3) */}
              {question.id === 3 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Rating
                    value={Number(answers[question.id]) || 0}
                    onChange={(e, newValue) => handleValueChange(question.id, newValue)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {answers[question.id] ? `${answers[question.id]} / 5` : "Sin calificar"}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Responder más tarde
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? "Guardando..." : "Enviar evaluación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
