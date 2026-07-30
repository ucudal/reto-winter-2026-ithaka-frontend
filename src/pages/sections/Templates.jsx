import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Tooltip,
  TablePagination,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import GenericCreateModal from "../../components/common/GenericCreateModal";
import GenericEditModal from "../../components/common/GenericEditModal";
import { getMaterials, createMaterial, upsertMaterial, deleteMaterial } from "../../api/endpoints/materials";
import { useToast } from "../../ToastContext";

function getPlatformIcon(platform = "") {
  const lower = platform.toLowerCase();
  if (lower === "drive") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InsertDriveFileIcon fontSize="small" sx={{ color: "#0F9D58" }} />
        <span>Google Drive</span>
      </Box>
    );
  }
  if (lower === "sharepoint") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CloudQueueIcon fontSize="small" sx={{ color: "#0078D4" }} />
        <span>SharePoint</span>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <InsertDriveFileIcon fontSize="small" sx={{ color: "action.active" }} />
      <span>{platform || "Documento"}</span>
    </Box>
  );
}

function getPlatformLabel(url = "") {
  const normalized = url.toLowerCase();
  if (normalized.includes("drive.google.com") || normalized.includes("docs.google.com")) {
    return "Drive";
  }
  if (normalized.includes("sharepoint.com")) {
    return "SharePoint";
  }
  if (normalized.includes("github.com")) {
    return "GitHub";
  }
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "YouTube";
  }
  return "Documento";
}

function mapMaterialToTemplate(material) {
  return {
    id: material.id,
    name: material.title || material.name || `Material ${material.id}`,
    platform: getPlatformLabel(material.url || material.description || ""),
    type: material.type || "Material",
    description: material.url || material.description || "",
    content: material.url || material.description || "",
  };
}

function Templates() {
  const { showToast } = useToast();
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('name')
  const [view, setView] = useState('list')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true

    async function loadTemplates() {
      setLoading(true)
      setError(null)

      try {
        const params = {
          page: page + 1,
          page_size: rowsPerPage,
          search: search || undefined,
        };
        const res = await getMaterials(params)
        if (!isMounted) return
        const list = res?.items ?? (Array.isArray(res) ? res : []);
        const mappedTemplates = list.map(mapMaterialToTemplate)
        setTemplates(mappedTemplates)
        setTotalCount(res?.total ?? list.length)
      } catch (err) {
        if (!isMounted) return
        setError(err?.message || 'No se pudieron cargar los templates.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    loadTemplates()

    return () => {
      isMounted = false
    }
  }, [page, rowsPerPage, search])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const value =
        template[filter]?.toString().toLowerCase() || ''
      return value.includes(search.toLowerCase())
    })
  }, [templates, search, filter])

  const [openModal, setOpenModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <ErrorState title='Error cargando templates' message={error} />
  }

  const templateFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      name: "content",
      label: "Contenido",
      type: "editor",
      required: true,
    },
  ];

  const handleCreateTemplate = async (data) => {
    try {
      const created = await createMaterial({
        name: data.name,
        description: data.description,
        content: data.content,
      });
      showToast("Template creado correctamente.", "success");
      const mapped = mapMaterialToTemplate(created || { ...data, id: Date.now() });
      setTemplates((prev) => [mapped, ...prev]);
      setOpenModal(false);
    } catch (err) {
      showToast(err?.message || "No se pudo crear el template.", "error");
    }
  };

  const handleUpdateTemplate = async (data) => {
    try {
      setSaving(true);
      const updated = await upsertMaterial({
        id: Number(data.id),
        title: data.name,
        url: data.content || data.description || "",
      });
      showToast("Template actualizado correctamente.", "success");
      const mapped = mapMaterialToTemplate(updated || { ...data });
      setTemplates((prev) =>
        prev.map((t) => (t.id === mapped.id ? mapped : t)),
      );
      setEditingTemplate(null);
    } catch (err) {
      showToast(err?.message || "No se pudo actualizar el template.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    try {
      setDeleting(true);
      await deleteMaterial(templateToDelete.id);
      showToast("Template eliminado correctamente.", "success");
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
      setTemplateToDelete(null);
    } catch (err) {
      showToast(err?.message || "No se pudo eliminar el template.", "error");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        sx={{ mb: 1 }}
      >
        <Typography color='text.primary'>
          Templates
        </Typography>
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
        <Typography variant='h4'>
          Templates
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="templates-view-label">Vista</InputLabel>
            <Select
              labelId="templates-view-label"
              id="templates-view"
              value={view}
              label="Vista"
              onChange={(e) => setView(e.target.value)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  {view === "gallery" ? (
                    <ViewModuleIcon fontSize="small" />
                  ) : (
                    <ViewListIcon fontSize="small" />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="list">Tabla</MenuItem>
              <MenuItem value="gallery">Galería</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{ height: 40 }}
          >
            Nuevo Template
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "stretch" }}>
        <TextField
          label="Buscar"
          placeholder="Ingrese un dato"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 60,
            },
          }}
        />
        <TextField
          select
          label="Filtrar por"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="filled"
          sx={{
            width: 280,
            "& .MuiFilledInput-root": {
              height: 60,
              bgcolor: "action.hover",
              "&:hover": {
                bgcolor: "action.hover",
              },
              "&.Mui-focused": {
                bgcolor: "action.hover",
              },
              "&:before": {
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },
              "&:after": {
                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
              },
            },
            "& .MuiInputLabel-root": {
              color: "primary.main",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "primary.main",
            },
          }}
        >
          <MenuItem value="name">Nombre</MenuItem>
          <MenuItem value="type">Tipo</MenuItem>
        </TextField>
      </Box>

      {view === 'list' ? (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Plataforma</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Tipo</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id} hover>
                      <TableCell sx={{ fontWeight: "medium" }}>{template.name}</TableCell>
                      <TableCell>{getPlatformIcon(template.platform)}</TableCell>
                      <TableCell>{template.type}</TableCell>
                      <TableCell align='right'>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Ver / Copiar plantilla (Word)">
                            <IconButton
                              color='info'
                              size="small"
                              onClick={() => navigate(`/templates/${template.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar datos">
                            <IconButton
                              color='primary'
                              size="small"
                              onClick={() => setEditingTemplate(template)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              color='error'
                              size="small"
                              onClick={() => setTemplateToDelete(template)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState
                        title='No hay templates'
                        description='No se encontraron plantillas.'
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      ) : (
        <Box>
          <Grid container spacing={3}>
            {filteredTemplates.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <EmptyState
                    title='No hay templates'
                    description='No se encontraron plantillas.'
                  />
                </Box>
              </Grid>
            ) : (
              filteredTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {template.description}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                        <Chip label={template.type} size="small" color="primary" variant="outlined" />
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {getPlatformIcon(template.platform)}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                      <Tooltip title="Ver / Copiar plantilla (Word)">
                        <IconButton
                          color='info'
                          onClick={() => navigate(`/templates/${template.id}`)}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar datos">
                        <IconButton
                          color='primary'
                          onClick={() => setEditingTemplate(template)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color='error'
                          onClick={() => setTemplateToDelete(template)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{ mt: 2 }}
          />
        </Box>
      )}
      <GenericCreateModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Nuevo Template"
        fields={templateFields}
        initialValues={{
          name: "",
          description: "",
          content: "",
        }}
        onSubmit={handleCreateTemplate}
      />

      <GenericEditModal
        open={Boolean(editingTemplate)}
        onClose={() => setEditingTemplate(null)}
        title="Editar Template"
        fields={templateFields}
        record={editingTemplate}
        onSubmit={handleUpdateTemplate}
        loading={saving}
      />

      <Dialog
        open={Boolean(templateToDelete)}
        onClose={() => setTemplateToDelete(null)}
      >
        <DialogTitle>Eliminar plantilla</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la plantilla{" "}
            <strong>{templateToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateToDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteTemplate}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Templates
