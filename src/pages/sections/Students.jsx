import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/endpoints/students'
import EmptyState from '../../components/common/EmptyState'
import GenericCreateModal from '../../components/common/GenericCreateModal'
import GenericEditModal from '../../components/common/GenericEditModal'
import { useToast } from '../../ToastContext'

const STUDENT_FIELDS = [
  { name: 'name', label: 'Nombre completo', type: 'text', required: true, grid: 12 },
  { name: 'email', label: 'Correo electrónico', type: 'text', required: true, grid: 12 },
  { name: 'major', label: 'Carrera', type: 'text', required: true, grid: 12 },
]

function Students() {
  const { showToast } = useToast()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('name')
  const [view, setView] = useState('list')

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const [editingStudent, setEditingStudent] = useState(null)
  const [saving, setSaving] = useState(false)

  const [studentToDelete, setStudentToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadStudents()
  }, [page, rowsPerPage, search])

  async function loadStudents() {
    try {
      setLoading(true)
      setError("")
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        search: search || undefined,
      }
      const data = await getStudents(params)
      setStudents(data?.items ?? [])
      setTotalCount(data?.total ?? 0)
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los alumnos.")
    } finally {
      setLoading(false);
    }
  }

  const handleCreateStudent = async (formData) => {
    try {
      setCreating(true)
      await createStudent({
        name: formData.name,
        email: formData.email,
        major: formData.major,
      })
      showToast('Alumno creado correctamente.', 'success')
      setCreateOpen(false)
      await loadStudents()
    } catch (err) {
      showToast(err?.message || 'No se pudo crear el alumno.', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStudent = async (formData) => {
    try {
      setSaving(true)
      await updateStudent(formData.id, {
        name: formData.name,
        email: formData.email,
        major: formData.major,
      })
      showToast('Alumno actualizado correctamente.', 'success')
      setEditingStudent(null)
      await loadStudents()
    } catch (err) {
      showToast(err?.message || 'No se pudo actualizar el alumno.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return
    try {
      setDeleting(true)
      await deleteStudent(studentToDelete.id)
      showToast('Alumno eliminado correctamente.', 'success')
      setStudentToDelete(null)
      await loadStudents()
    } catch (err) {
      showToast(err?.message || 'No se pudo eliminar el alumno.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 1 }}
      >
        <Typography color="text.primary">Alumnos</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4">Alumnos</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="students-view-label">Vista</InputLabel>
            <Select
              labelId="students-view-label"
              id="students-view"
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
            onClick={() => setCreateOpen(true)}
            sx={{ height: 40 }}
          >
            Nuevo alumno
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'stretch' }}>
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
              '& .MuiOutlinedInput-root': {
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
              '& .MuiFilledInput-root': {
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
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="major">Carrera</MenuItem>
          </TextField>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : view === 'list' ? (
          <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Carrera</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => {
                    const initials = (student.name || 'U')
                      .split(' ')
                      .filter(Boolean)
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()

                    return (
                      <TableRow key={student.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                              }}
                            >
                              {initials}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {student.name}
                              </Typography>
                              {student.is_graduation_project && (
                                <Chip
                                  label="Proyecto Final"
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{ height: 18, fontSize: '0.65rem', mt: 0.2 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{student.email || '-'}</TableCell>
                        <TableCell>{student.major || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label="Activo"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {student.id}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            {student.linkedin_url && (
                              <Tooltip title="Ver LinkedIn">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  component="a"
                                  href={student.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <LinkedInIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => setEditingStudent(student)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setStudentToDelete(student)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <EmptyState
                        title="No hay alumnos para mostrar"
                        description="No se encontraron alumnos que coincidan con la búsqueda."
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
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
          </>
        ) : (
          <>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {students.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <EmptyState
                    title="No hay alumnos para mostrar"
                    description="No se encontraron alumnos que coincidan con la búsqueda."
                  />
                </Box>
              </Grid>
            ) : (
              students.map((student) => {
                const initials = (student.name || 'U')
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase();

                return (
                  <Grid item xs={12} sm={6} md={4} key={student.id}>
                    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 44, height: 44 }}>
                            {initials}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {student.id}
                            </Typography>
                          </Box>
                        </Box>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <SchoolOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{student.major || '-'}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EmailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {student.email || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <Chip label="Activo" size="small" color="success" />
                        <Box>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setEditingStudent(student)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setStudentToDelete(student)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })
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
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
        )}
      </Paper>

      <GenericCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nuevo Alumno"
        fields={STUDENT_FIELDS}
        initialValues={{ name: '', email: '', major: '' }}
        onSubmit={handleCreateStudent}
        loading={creating}
      />

      <GenericEditModal
        open={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        title="Editar Alumno"
        fields={STUDENT_FIELDS}
        record={editingStudent}
        onSubmit={handleUpdateStudent}
        loading={saving}
      />

      <Dialog
        open={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
      >
        <DialogTitle>Eliminar alumno</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al alumno{" "}
            <strong>{studentToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentToDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteStudent}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Students
