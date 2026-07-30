import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
  getGroupDocuments,
  upsertGroupDocument,
  deleteDocument,
} from "../api/endpoints/documents";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../ToastContext";
import {
  DOCUMENT_URL_MAX_LENGTH,
  getDocumentHref,
  getDocumentLabel,
  getPlatformForUrl,
} from "../utils/documentLinks";
import { isValidUrl } from "../utils/validators";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./common/EmptyState";

export default function GroupDocumentsCard({ groupId, sx }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  // PUT /documents pide tutor o coordinador; DELETE /documents/{id} pide
  // coordinador. Gateamos igual acá para no mostrar botones que dan 403.
  const canEdit = Boolean(user) && user.role !== "Student";
  const canDelete = user?.role === "Coordinator";

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getGroupDocuments(groupId);
      setDocuments(data ?? []);
    } catch (err) {
      setDocuments([]);
      setError(err?.message || "No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      loadDocuments();
    }
  }, [groupId, loadDocuments]);

  const openDialog = () => {
    setUrl("");
    setUrlError("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const trimmed = url.trim();

    if (!isValidUrl(trimmed)) {
      setUrlError("Pegá un link válido que empiece con http:// o https://");
      return;
    }

    if (trimmed.length > DOCUMENT_URL_MAX_LENGTH) {
      setUrlError(
        `El link no puede superar los ${DOCUMENT_URL_MAX_LENGTH} caracteres.`,
      );
      return;
    }

    const nextOrder =
      documents.reduce((max, doc) => Math.max(max, doc.order ?? 0), 0) + 1;

    try {
      setSaving(true);
      const created = await upsertGroupDocument(groupId, {
        url: trimmed,
        platform: getPlatformForUrl(trimmed),
        order: nextOrder,
      });
      setDocuments((prev) => [...prev, created]);
      setDialogOpen(false);
      showToast("Link agregado.", "success");
    } catch (err) {
      showToast(err?.message || "No se pudo agregar el link.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    const { id } = documentToDelete;

    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      showToast("Link eliminado.", "success");
    } catch (err) {
      showToast(err?.message || "No se pudo eliminar el link.", "error");
    }
  };

  return (
    <Card sx={sx}>
      <CardContent sx={{ pb: "12px !important" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <LinkIcon color="action" fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
              Documentos ({documents.length})
            </Typography>
          </Stack>

          {canEdit && (
            <Button size="small" startIcon={<AddIcon />} onClick={openDialog}>
              Agregar
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            {!error && documents.length === 0 ? (
              <EmptyState
                title="Sin documentos"
                description="Todavía no hay links cargados para este grupo."
              />
            ) : (
              <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                <List dense disablePadding>
                  {documents.map((doc) => {
                    const href = getDocumentHref(doc.url);

                    return (
                      <ListItem
                        key={doc.id}
                        divider
                        sx={{ px: 0 }}
                        secondaryAction={
                          canDelete ? (
                            <Tooltip title="Eliminar link">
                              <IconButton
                                size="small"
                                color="error"
                                aria-label="Eliminar link"
                                onClick={() => setDocumentToDelete(doc)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null
                        }
                      >
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              {href ? (
                                <>
                                  <Typography
                                    component="a"
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      color: "primary.main",
                                      textDecoration: "none",
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    {getDocumentLabel(doc.url)}
                                  </Typography>
                                  <OpenInNewIcon
                                    fontSize="inherit"
                                    color="action"
                                  />
                                </>
                              ) : (
                                <Typography variant="body2" fontWeight={500}>
                                  {getDocumentLabel(doc.url)}
                                </Typography>
                              )}
                            </Stack>
                          }
                          secondary={doc.url}
                          secondaryTypographyProps={{
                            variant: "caption",
                            noWrap: true,
                            sx: { wordBreak: "break-all" },
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
          </>
        )}
      </CardContent>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Agregar link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Link"
            placeholder="https://..."
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setUrlError("");
            }}
            error={Boolean(urlError)}
            helperText={
              urlError ||
              "Cualquier link sirve: Drive, SharePoint, un repo, un informe."
            }
            inputProps={{ maxLength: DOCUMENT_URL_MAX_LENGTH }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !url.trim()}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmModal
        open={Boolean(documentToDelete)}
        title="Eliminar link"
        message="Esta acción no se puede deshacer. ¿Querés eliminar este link?"
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDocumentToDelete(null)}
      />
    </Card>
  );
}
