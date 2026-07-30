import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
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
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import GenericCreateModal from "../../components/common/GenericCreateModal";
import { getMaterials } from "../../api/endpoints/materials";

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
  if (lower === "sharepoint" || lower === "sharepoint") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CloudQueueIcon fontSize="small" sx={{ color: "#0078D4" }} />
        <span>SharePoint</span>
      </Box>
    );
  }
  return <span>{platform}</span>;
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
  return "Enlace";
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
  const handleCreateTemplate = (data) => {
    const newTemplate = {
      id: Date.now(),
      platform: "Drive",
      type: "Deliverable",
      ...data,
    };

    setTemplates((prev) => [...prev, newTemplate]);

    setOpenModal(false);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          to='/'
          underline='hover'
          color='inherit'
        >
          Inicio
        </Link>
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
                        <IconButton
                          color='primary'
                          onClick={() => navigate(`/templates/${template.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
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
                      <Tooltip title="Editar">
                        <IconButton
                          color='primary'
                          onClick={() => navigate(`/templates/${template.id}`)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
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
    </Box>
  )

}

export default Templates
