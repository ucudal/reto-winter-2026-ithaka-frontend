import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";

import {
  getDeliverableComments,
  createDeliverableComment,
  deleteComment,
} from "../api/endpoints/comments";
import { getTutors } from "../api/endpoints/tutors";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../ToastContext";
import { sanitizeText } from "../utils/sanitize";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./common/EmptyState";

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CommentFeed({ deliverableId }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [tutorsById, setTutorsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const requestIdRef = useRef(0);

  const loadComments = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    const [commentsResult, tutorsResult] = await Promise.allSettled([
      getDeliverableComments(deliverableId),
      getTutors(),
    ]);

    // Descarta la respuesta si mientras tanto se disparó otra carga
    if (requestId !== requestIdRef.current) return;

    if (commentsResult.status === "fulfilled") {
      setComments(commentsResult.value ?? []);
    } else {
      setComments([]);
      setError(
        commentsResult.reason?.message ||
          "No se pudieron cargar los comentarios.",
      );
    }

    if (tutorsResult.status === "fulfilled") {
      setTutorsById(
        Object.fromEntries(
          (tutorsResult.value ?? []).map((t) => [t.id, t.name]),
        ),
      );
    } else {
      setTutorsById({});
    }

    setLoading(false);
  }, [deliverableId]);

  useEffect(() => {
    if (deliverableId) {
      loadComments();
    }
  }, [deliverableId, loadComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = sanitizeText(newComment);
    if (!content) {
      showToast("El comentario no puede estar vacío.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await createDeliverableComment(deliverableId, {
        tutor_id: user.id,
        content,
      });
      setNewComment("");
      showToast("Comentario publicado.", "success");
      await loadComments();
    } catch (err) {
      showToast(err?.message || "No se pudo publicar el comentario.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await deleteComment(commentToDelete.id);
      showToast("Comentario eliminado.", "success");
      await loadComments();
    } catch (err) {
      showToast(err?.message || "No se pudo eliminar el comentario.", "error");
    }
  };

  const tutorName = (tutorId) => tutorsById[tutorId] || `Tutor #${tutorId}`;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comentarios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && comments.length === 0 && (
        <EmptyState
          title="Sin comentarios"
          description="Todavía no hay feedback para este entregable."
        />
      )}

      <Stack spacing={2} sx={{ mb: 3 }}>
        {comments.map((comment) => {
          const name = tutorName(comment.tutor_id);
          const isAuthor = user?.id === comment.tutor_id;

          return (
            <Paper
              key={comment.id}
              variant="outlined"
              sx={{ p: 2, display: "flex", gap: 1.5, alignItems: "flex-start" }}
            >
              <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                {getInitials(name)}
              </Avatar>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {sanitizeText(comment.content)}
                </Typography>
              </Box>

              {isAuthor && (
                <Tooltip title="Eliminar comentario">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Eliminar comentario"
                    onClick={() => setCommentToDelete(comment)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Paper>
          );
        })}
      </Stack>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={4}
            placeholder="Escribí un comentario..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={submitting || !newComment.trim()}
          >
            Enviar
          </Button>
        </Stack>
      </Box>

      <ConfirmModal
        open={Boolean(commentToDelete)}
        title="Eliminar comentario"
        message="Esta acción no se puede deshacer. ¿Quieres eliminar este comentario?"
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setCommentToDelete(null)}
      />
    </Box>
  );
}
